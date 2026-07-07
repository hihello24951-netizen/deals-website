"use client";

import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { Deal } from "@/types";

interface ProductModalProps {
  deal: Deal;
  storeUrl: string;
  onClose: () => void;
}

export default function ProductModal({ deal, storeUrl, onClose }: ProductModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-sm"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 rounded-t-2xl overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-200" />
          )}
          <img
            src={deal.image}
            alt={deal.title}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
            {deal.discountPercent}% OFF
          </span>
        </div>

        {/* Details */}
        <div className="p-6">
          <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full mb-3">
            {deal.brandName}
          </span>

          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {deal.title}
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            {deal.description || "No description available for this product."}
          </p>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-gray-400 text-base line-through">
              Rs. {deal.originalPrice.toLocaleString()}
            </span>
            <span className="text-gray-900 font-bold text-2xl">
              Rs. {deal.salePrice.toLocaleString()}
            </span>
          </div>

          
          <a   href={deal.productUrl || storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-orange-500 text-white font-semibold py-3.5 rounded-xl transition-colors w-full"
          >
            Get This Deal
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}