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
      <p className="font-display font-bold text-ink text-sm tracking-tight">{brand.name}</p>
    );
  }

  return (
    <img
      src={`https://cdn.brandfetch.io/${domain}/w/128/h/128/logo?c=${BRANDFETCH_CLIENT_ID}`}
      alt={brand.name}
      onError={() => setFailed(true)}
      className="h-7 max-w-[85%] object-contain select-none filter dark:invert-0 grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
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
    <div className="w-full py-6">
      {/* Structural Minimal Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono tracking-widest text-ink-light uppercase">
          Curated Houses
        </h3>
        {selectedBrandId && (
          <button 
            onClick={() => onBrandClick(null)}
            className="text-[11px] font-mono text-accent hover:underline focus:outline-none"
          >
            Clear Selection [×]
          </button>
        )}
      </div>

      {/* Horizontal Smooth Elastic Ribbon Track */}
      <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar mask-inline-edges">
        {filteredBrands.map((brand, idx) => {
          const isSelected = selectedBrandId === brand.id;
          
          return (
            <button
              key={brand.id}
              onClick={() => onBrandClick(isSelected ? null : brand.id)}
              style={{ "--brand-color-accent": brand.color || "#FF5A1F" } as React.CSSProperties}
              className={`group relative flex-shrink-0 min-w-[140px] max-w-[180px] bg-canvas-card border rounded-card p-4 flex flex-col justify-between items-start transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 focus:outline-none ${
                isSelected
                  ? "border-ink shadow-premium-hover scale-[0.98] ring-1 ring-ink"
                  : "border-glass shadow-premium hover:border-ink-light/20"
              }`}
            >
              {/* Subtle Dynamic Brand Color Bar Indicator */}
              <div 
                className="absolute top-0 left-4 right-4 h-[2px] rounded-b-pill opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: brand.color }}
              />

              {/* Logo Frame */}
              <div className="h-10 w-full flex items-center justify-start mt-1">
                <BrandLogo brand={brand} />
              </div>

              {/* Micro Metadata Indicator Footer */}
              <div className="mt-4 w-full flex items-center justify-between gap-2">
                <span className="text-[9px] font-mono text-ink-light/40 uppercase tracking-tight truncate max-w-[60%]">
                  {brand.name}
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-canvas-base border border-glass rounded-md text-ink-light group-hover:text-accent group-hover:border-accent/20 transition-colors duration-300">
                  {brand.itemsLive} LIVE
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}