import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import * as cheerio from "cheerio";
import brandsData from "../../../../data/brands.json";
import { Brand } from "@/types";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const brands = brandsData as Brand[];

interface ScrapedDeal {
  id: string;
  brandId: string;
  brandName: string;
  category: string;
  title: string;
  description: string;
  images: string[];
  options: { name: string; values: string[] }[];
  productType: string;
  vendor: string;
  tags: string[];
  originalPrice: number;
  discountPercent: number;
  salePrice: number;
  sourceUrl: string;
  productUrl: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function findCandidateProductUrls(brand: Brand): Promise<string[]> {
  try {
    const res = await fetch(brand.storeUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(10000),
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const urls = new Set<string>();

    $("a").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;
      if (!/\/products?\//i.test(href)) return;

      let full = href;
      if (!full.startsWith("http")) {
        try {
          full = new URL(href, brand.storeUrl).href;
        } catch {
          return;
        }
      }
      urls.add(full);
    });

    return Array.from(urls).slice(0, 10);
  } catch {
    return [];
  }
}

async function tryShopifyJson(productUrl: string) {
  try {
    const jsonUrl = productUrl.split("?")[0].replace(/\/?$/, "") + ".json";
    const res = await fetch(jsonUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const data = await res.json();
    const product = data.product;
    if (!product || !product.variants || product.variants.length === 0) return null;

    const variant = product.variants[0];
    const salePrice = parseFloat(variant.price);
    const originalPrice = variant.compare_at_price
      ? parseFloat(variant.compare_at_price)
      : null;

    if (!salePrice || !originalPrice || originalPrice <= salePrice) return null;

    const discountPercent = Math.round(
      ((originalPrice - salePrice) / originalPrice) * 100
    );

    const images: string[] = Array.isArray(product.images)
      ? product.images.map((img: any) => img.src).filter(Boolean)
      : [];

    const options = Array.isArray(product.options)
      ? product.options.map((opt: any) => ({
          name: opt.name,
          values: opt.values || [],
        }))
      : [];

    const tags: string[] =
      typeof product.tags === "string"
        ? product.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];

    return {
      title: product.title || "",
      description: stripHtml(product.body_html || "").slice(0, 1500),
      images,
      options,
      productType: product.product_type || "",
      vendor: product.vendor || "",
      tags,
      originalPrice: Math.round(originalPrice),
      discountPercent,
      salePrice: Math.round(salePrice),
    };
  } catch {
    return null;
  }
}

async function tryJsonLd(productUrl: string) {
  try {
    const res = await fetch(productUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);
    let found: any = null;

    $('script[type="application/ld+json"]').each((_, el) => {
      if (found) return;
      try {
        const raw = $(el).html() || "{}";
        const json = JSON.parse(raw);
        const items = Array.isArray(json) ? json : [json];

        for (const item of items) {
          if (item["@type"] !== "Product" || !item.offers) continue;

          const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
          const price = parseFloat(offers.price);
          const highPrice = offers.highPrice ? parseFloat(offers.highPrice) : null;

          if (!price || !highPrice || highPrice <= price) continue;

          const imgField = item.image;
          const images: string[] = Array.isArray(imgField)
            ? imgField
            : imgField
            ? [imgField]
            : [];

          found = {
            title: item.name || "",
            description: (item.description || "").slice(0, 1500),
            images,
            options: [],
            productType: item.category || "",
            vendor: item.brand?.name || "",
            tags: [],
            salePrice: Math.round(price),
            originalPrice: Math.round(highPrice),
          };
        }
      } catch {
        // ignore malformed JSON-LD blocks
      }
    });

    if (!found) return null;

    const discountPercent = Math.round(
      ((found.originalPrice - found.salePrice) / found.originalPrice) * 100
    );

    return { ...found, discountPercent };
  } catch {
    return null;
  }
}

async function scrapeBrand(brand: Brand): Promise<ScrapedDeal[]> {
  const deals: ScrapedDeal[] = [];
  const candidateUrls = await findCandidateProductUrls(brand);

  for (const productUrl of candidateUrls) {
    if (deals.length >= 8) break;

    let result = await tryShopifyJson(productUrl);
    if (!result) {
      result = await tryJsonLd(productUrl);
    }
    if (!result) continue;

    deals.push({
      id: `${brand.id}-${deals.length}`,
      brandId: brand.id,
      brandName: brand.name,
      category: brand.category,
      title: result.title || `${brand.name} Item`,
      description: result.description || "No description available.",
      images: result.images && result.images.length > 0 ? result.images : [],
      options: result.options || [],
      productType: result.productType || "",
      vendor: result.vendor || "",
      tags: result.tags || [],
      originalPrice: result.originalPrice,
      discountPercent: result.discountPercent,
      salePrice: result.salePrice,
      sourceUrl: brand.storeUrl,
      productUrl,
    });

    await new Promise((r) => setTimeout(r, 300));
  }

  return deals;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, ScrapedDeal[]> = {};
  let totalFound = 0;

  for (const brand of brands) {
    const deals = await scrapeBrand(brand);
    if (deals.length > 0) {
      results[brand.id] = deals;
      totalFound += deals.length;
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  await redis.set("scraped-deals", JSON.stringify(results));
  await redis.set("scraped-deals-updated-at", Date.now());

  return NextResponse.json({
    success: true,
    brandsScraped: Object.keys(results).length,
    totalDeals: totalFound,
  });
}