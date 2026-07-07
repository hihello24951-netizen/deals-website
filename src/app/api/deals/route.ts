import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import fallbackDealsData from "../../../../data/deals.json";
import { Deal } from "@/types";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const fallbackDeals = fallbackDealsData as Deal[];

export async function GET() {
  try {
    const raw = await redis.get<string>("scraped-deals");

    if (!raw) {
      // No scrape has ever run — just return all mock data
      return NextResponse.json({ deals: fallbackDeals, live: false });
    }

    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const scrapedBrandIds = new Set(Object.keys(parsed));

    const deals: Deal[] = [];
    let idCounter = 1;

    // Add real scraped deals for brands that succeeded
    for (const brandId of scrapedBrandIds) {
      for (const item of parsed[brandId]) {
        deals.push({
          id: idCounter++,
          brandId: item.brandId,
          brandName: item.brandName,
          category: item.category,
          title: item.title,
          image: item.image,
          originalPrice: item.originalPrice,
          discountPercent: item.discountPercent,
          salePrice: item.salePrice,
        });
      }
    }

    // Fill in mock data ONLY for brands that were not successfully scraped
    for (const deal of fallbackDeals) {
      if (!scrapedBrandIds.has(deal.brandId)) {
        deals.push({ ...deal, id: idCounter++ });
      }
    }

    return NextResponse.json({ deals, live: true });
  } catch (err) {
    return NextResponse.json({ deals: fallbackDeals, live: false });
  }
}