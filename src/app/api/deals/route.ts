import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Deal } from "@/types";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  try {
    const raw = await redis.get<string>("scraped-deals");
    if (!raw) {
      return NextResponse.json({ deals: [] });
    }

    const parsed =
      typeof raw === "string" ? JSON.parse(raw) : raw;

    const deals: Deal[] = [];
    let idCounter = 1;

    for (const brandId of Object.keys(parsed)) {
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

    return NextResponse.json({ deals });
  } catch (err) {
    return NextResponse.json({ deals: [] });
  }
}