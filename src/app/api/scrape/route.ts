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
  image: string;
  originalPrice: number;
  discountPercent: number;
  salePrice: number;
  sourceUrl: string;
}

function extractPrice(text: string): number | null {
  const match = text.replace(/,/g, "").match(/(?:rs\.?|pkr)\s*(\d{3,6})/i);
  return match ? parseInt(match[1], 10) : null;
}

async function scrapeBrand(brand: Brand): Promise<ScrapedDeal[]> {
  const deals: ScrapedDeal[] = [];

  try {
    const res = await fetch(brand.storeUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(10000),
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    // Heuristic: look for product cards containing both a price-like
    // number and a "sale"/"off"/"discount" signal nearby.
    $("[class*='product'], [class*='item'], article, li").each((_, el) => {
      if (deals.length >= 8) return; // cap per brand to avoid runaway scraping

      const blockText = $(el).text();
      const hasDiscountSignal = /(sale|off|discount|% off)/i.test(blockText);
      if (!hasDiscountSignal) return;

      const prices = blockText.match(/(?:rs\.?|pkr)\s*[\d,]{3,7}/gi);
      if (!prices || prices.length < 2) return;

      const nums = prices
        .map((p) => extractPrice(p))
        .filter((n): n is number => n !== null)
        .sort((a, b) => b - a);

      const originalPrice = nums[0];
      const salePrice = nums[nums.length - 1];
      if (!originalPrice || !salePrice || salePrice >= originalPrice) return;

      const discountPercent = Math.round(
        ((originalPrice - salePrice) / originalPrice) * 100
      );

      const titleGuess =
        $(el).find("h1,h2,h3,h4,a").first().text().trim().slice(0, 80) ||
        `${brand.name} Item`;

      deals.push({
        id: `${brand.id}-${deals.length}`,
        brandId: brand.id,
        brandName: brand.name,
        category: brand.category,
        title: titleGuess,
        image: "/images/placeholder.jpg",
        originalPrice,
        discountPercent,
        salePrice,
        sourceUrl: brand.storeUrl,
      });
    });
  } catch (err) {
    console.log(`Scrape failed for ${brand.name}:`, err);
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
    await new Promise((r) => setTimeout(r, 500)); // polite delay between brands
  }

  await redis.set("scraped-deals", JSON.stringify(results));
  await redis.set("scraped-deals-updated-at", Date.now());

  return NextResponse.json({
    success: true,
    brandsScraped: Object.keys(results).length,
    totalDeals: totalFound,
  });
}