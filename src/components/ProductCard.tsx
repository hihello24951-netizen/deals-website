"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Deal } from "@/types";

interface ProductCardProps {
  deal: Deal;
  isFeaturedVariant?: boolean;
}

export default function ProductCard({ deal, isFeaturedVariant = false }: ProductCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  // 1. Premium Featured Hero Variant Styling
  if (isFeaturedVariant) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full mt-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-inner bg-white/10 overflow-hidden relative border border-white/10 flex-shrink-0">
            <img 
              src={deal.image} 
              alt={deal.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-display font-bold text-white">
                Rs. {deal.salePrice.toLocaleString()}
              </span>
              <span className="text-sm line-through text-slate-400">
                Rs. {deal.originalPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-xs font-mono text-accent">Saved {deal.discountPercent}% instantly</p>
          </div>
        </div>
        
        <button
          onClick={() => router.push(`/product/${deal.id}`)}
          className="w-full sm:w-auto px-6 py-3 bg-accent hover:bg-accent-hover text-white font-sans font-medium text-sm rounded-pill shadow-glow transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-ink"
        >
          Claim Exclusive Offer
        </button>
      </div>
    );
  }

  // 2. Premium Standard Card Variant Styling
  return (
    <button
      onClick={() => router.push(`/product/${deal.id}`)}
      className="group bg-canvas-card rounded-card overflow-hidden border border-glass shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent p-2"
      aria-label={`View deal: ${deal.title} from ${deal.brandName}`}
    >
      {/* Media Frame utilizing inner boundary isolation */}
      <div className="relative aspect-[4/5] w-full bg-canvas-base overflow-hidden rounded-inner">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200/60 animate-pulse" />
        )}
        <img
          src={deal.image}
          alt={deal.title}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        />
        
        {/* Floating Accent Pill */}
        <span className="absolute top-3 left-3 bg-ink text-white font-mono text-[10px] tracking-wider font-bold px-2.5 py-1 rounded-pill shadow-premium border border-white/10 backdrop-blur-md">
          -{deal.discountPercent}%
        </span>
      </div>

      {/* Content Space */}
      <div className="p-3 pt-4 flex flex-col flex-1 w-full">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold truncate max-w-[70%]">
            {deal.brandName}
          </span>
          <span className="text-[11px] font-mono text-ink-light bg-canvas-base border border-glass px-1.5 py-0.5 rounded-md">
            Active
          </span>
        </div>

        <p className="text-sm font-sans font-medium text-ink line-clamp-2 mb-3 flex-1 leading-snug group-hover:text-accent transition-colors duration-300">
          {deal.title}
        </p>

        {/* Pricing Architecture */}
        <div className="flex items-baseline gap-2 pt-2 border-t border-glass mt-auto">
          <span className="text-base font-display font-bold text-ink">
            Rs. {deal.salePrice.toLocaleString()}
          </span>
          <span className="text-xs font-sans line-through text-ink-light/60">
            Rs. {deal.originalPrice.toLocaleString()}
          </span>
        </div>
      </div>
    </button>
  );
}