"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Deal } from "@/types";
import brandsData from "../../../../data/brands.json";
import { Brand } from "@/types";

const brands = brandsData as Brand[];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/deals")
      .then((res) => res.json())
      .then((data) => {
        const found = (data.deals as Deal[]).find(
          (d) => String(d.id) === params.id
        );
        setDeal(found || null);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-gray-500 text-sm">Product not found.</p>
        <button
          onClick={() => router.push("/")}
          className="text-sm font-semibold text-orange-500 hover:underline"
        >
          Back to homepage
        </button>
      </div>
    );
  }

  const brand = brands.find((b) => b.id === deal.brandId);
  const linkTarget = deal.productUrl || brand?.storeUrl || "#";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} />
          Back to deals
        </button>

        <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-black/5 grid md:grid-cols-2 gap-0">
          <div className="relative aspect-square bg-gray-100">
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
            <span className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm">
              {deal.discountPercent}% OFF
            </span>
          </div>

          <div className="p-8 flex flex-col">
            <span className="inline-block w-fit text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4">
              {deal.brandName}
            </span>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {deal.title}
            </h1>

            <p className="text-gray-600 leading-relaxed mb-6">
              {deal.description || "No description available for this product."}
            </p>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-gray-400 text-lg line-through">
                Rs. {deal.originalPrice.toLocaleString()}
              </span>
              <span className="text-gray-900 font-bold text-3xl">
                Rs. {deal.salePrice.toLocaleString()}
              </span>
            </div>

            
             <a  href={linkTarget}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-orange-500 text-white font-semibold py-4 rounded-xl transition-colors w-full"
            >
              Get This Deal
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}