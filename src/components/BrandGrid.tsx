"use client";

import { useState } from "react";
import { Brand } from "@/types";

const BRANDFETCH_CLIENT_ID = "1idaRgldOtf2NBp4hm4"; // paste your Client ID here

interface BrandGridProps {
  brands: Brand[];
  activeCategory: string;
  onBrandClick: (brandId: string | null) => void;
  selectedBrandId: string | null;
}

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
      <p className="font-semibold text-gray-900 text-sm mt-2">
        {brand.name}
      </p>
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Shop by Brand
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredBrands.map((brand) => (
          <button
            key={brand.id}
            onClick={() =>
              onBrandClick(selectedBrandId === brand.id ? null : brand.id)
            }
            style={{ backgroundColor: brand.color }}
            className={`relative rounded-2xl p-4 text-left transition-transform hover:scale-[1.03] ${
              selectedBrandId === brand.id
                ? "ring-2 ring-orange-500"
                : "ring-1 ring-black/5"
            }`}
          >
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
              {brand.itemsLive.toLocaleString()} ITEMS LIVE
            </span>
            <BrandLogo brand={brand} />
          </button>
        ))}
      </div>
    </div>
  );
}