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
      className="bg-white rounded-2xl overflow-hidden ring-1 ring-black/5 hover:shadow-lg transition-shadow flex flex-col text-left w-full"
    >
      <div className="relative aspect-[3/4] bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <img
          src={deal.image}
          alt={deal.title}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
          {deal.discountPercent}% OFF
        </span>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <span className="inline-block w-fit text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mb-1">
          {deal.brandName}
        </span>
        <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 flex-1">
          {deal.title}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs line-through">
            Rs. {deal.originalPrice.toLocaleString()}
          </span>
          <span className="text-gray-900 font-bold text-sm">
            Rs. {deal.salePrice.toLocaleString()}
          </span>
        </div>
      </div>
    </button>
  );
}