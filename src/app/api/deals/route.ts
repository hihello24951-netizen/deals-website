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
      return NextResponse.json({ deals: [], live: true });
    }

    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const deals: Deal[] = [];

    for (const brandId of Object.keys(parsed)) {
      parsed[brandId].forEach((item: any, index: number) => {
        deals.push({
          id: `${brandId}-${index}`,
          brandId: item.brandId,
          brandName: item.brandName,
          category: item.category,
          title: item.title,
          description: item.description,
          image: item.images && item.images.length > 0 ? item.images[0] : "",
          images: item.images || [],
          options: item.options || [],
          productType: item.productType,
          vendor: item.vendor,
          tags: item.tags || [],
          originalPrice: item.originalPrice,
          discountPercent: item.discountPercent,
          salePrice: item.salePrice,
          productUrl: item.productUrl,
        });
      });
    }

    return NextResponse.json({ deals, live: true });
  } catch (err) {
    return NextResponse.json({ deals: [], live: true });
  }
}