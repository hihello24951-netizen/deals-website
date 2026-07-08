"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Deal } from "@/types";

interface ProductCardProps {
  deal: Deal;
}

export default function ProductCard({ deal }: ProductCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <button
      onClick={() => router.push(`/product/${deal.id}`)}
      className="group bg-surface rounded-2xl overflow-hidden ring-1 ring-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col text-left w-full animate-fade-in focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={`View deal: ${deal.title} from ${deal.brandName}`}
    >
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <img
          src={deal.image}
          alt={deal.title}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <span className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
          {deal.discountPercent}% OFF
        </span>
      </div>

      <div className="p-3.5 flex flex-col flex-1">
        <span className="inline-block w-fit text-[10px] font-semibold text-muted bg-gray-100 px-2 py-0.5 rounded-full mb-1.5">
          {deal.brandName}
        </span>
        <p className="text-sm font-medium text-brand line-clamp-2 mb-2 flex-1 leading-snug">
          {deal.title}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-muted text-xs line-through">
            Rs. {deal.originalPrice.toLocaleString()}
          </span>
          <span className="text-brand font-bold text-sm">
            Rs. {deal.salePrice.toLocaleString()}
          </span>
        </div>
      </div>
    </button>
  );
}