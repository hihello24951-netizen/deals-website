"use client";

import { useState } from "react";
import { Brand } from "@/types";

interface BrandGridProps {
  brands: Brand[];
  activeCategory: string;
  onBrandClick: (brandId: string | null) => void;
  selectedBrandId: string | null;
}

const BRANDFETCH_CLIENT_ID = "1idaRgldOtf2NBp4hm4";

function getDomain(storeUrl: string) {
  try {
    return new URL(storeUrl).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

function BrandLogo({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);
  const domain = getDomain(brand.storeUrl);

  if (failed || !domain) {
    return (
      <p className="font-semibold text-brand text-sm mt-2">{brand.name}</p>
    );
  }

  return (
    <img
      src={`https://cdn.brandfetch.io/${domain}/w/128/h/128/logo?c=${BRANDFETCH_CLIENT_ID}`}
      alt={brand.name}
      onError={() => setFailed(true)}
      className="h-8 max-w-[80%] object-contain mt-2"
    />
  );
}

export default function BrandGrid({
  brands,
  activeCategory,
  onBrandClick,
  selectedBrandId,
}: BrandGridProps) {
  const filteredBrands =
    activeCategory === "All"
      ? brands
      : brands.filter((b) => b.category === activeCategory);

  if (filteredBrands.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-lg font-semibold text-brand mb-4 tracking-tight">
        Shop by Brand
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredBrands.map((brand, idx) => (
          <button
            key={brand.id}
            onClick={() =>
              onBrandClick(selectedBrandId === brand.id ? null : brand.id)
            }
            style={{ backgroundColor: brand.color, animationDelay: `${idx * 30}ms` }}
            className={`relative rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover animate-fade-in focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              selectedBrandId === brand.id
                ? "ring-2 ring-accent"
                : "ring-1 ring-black/5"
            }`}
          >
            <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
              {brand.itemsLive.toLocaleString()} ITEMS LIVE
            </span>
            <BrandLogo brand={brand} />
          </button>
        ))}
      </div>
    </div>
  );
}