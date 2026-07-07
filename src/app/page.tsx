"use client";

import { useState, useMemo, useEffect, useDeferredValue } from "react";
import Navbar from "@/components/Navbar";
import BrandGrid from "@/components/BrandGrid";
import ProductCard from "@/components/ProductCard";
import brandsData from "../../data/brands.json";
import fallbackDealsData from "../../data/deals.json";
import { Brand, Deal } from "@/types";

const brands = brandsData as Brand[];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [liveDeals, setLiveDeals] = useState<Deal[] | null>(null);
  const [loadingLive, setLoadingLive] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    fetch("/api/deals")
      .then((res) => res.json())
      .then((data) => {
        setLiveDeals(data.deals || []);
      })
      .catch(() => {
        setLiveDeals([]);
      })
      .finally(() => setLoadingLive(false));
  }, []);

  const deals = liveDeals ?? [];

  const brandMap = useMemo(() => {
    const map: Record<string, Brand> = {};
    brands.forEach((b) => (map[b.id] = b));
    return map;
  }, []);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesCategory =
        activeCategory === "All" || deal.category === activeCategory;
      const matchesBrand =
        !selectedBrandId || deal.brandId === selectedBrandId;
      const matchesSearch =
        deferredSearchQuery.trim() === "" ||
        deal.title.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
        deal.brandName.toLowerCase().includes(deferredSearchQuery.toLowerCase());

      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [deals, activeCategory, selectedBrandId, deferredSearchQuery]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <BrandGrid
        brands={brands}
        activeCategory={activeCategory}
        onBrandClick={setSelectedBrandId}
        selectedBrandId={selectedBrandId}
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedBrandId
              ? `Deals from ${brandMap[selectedBrandId]?.name}`
              : "Trending Deals"}
          </h2>
          {!loadingLive && (
            <span className="text-xs text-gray-400">
              Live prices only
            </span>
          )}
        </div>

        {filteredDeals.length === 0 ? (
          <p className="text-gray-500 text-sm py-10 text-center">
            No deals found. Try a different search or category.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredDeals.map((deal) => (
              <ProductCard
                key={deal.id}
                deal={deal}
                onOpen={setSelectedDeal}
              />
            ))}
          </div>
        )}
      </div>
    {selectedDeal && (
        <ProductModal
          deal={selectedDeal}
          storeUrl={brandMap[selectedDeal.brandId]?.storeUrl ?? "#"}
          onClose={() => setSelectedDeal(null)}
        />
      )}
    </main>
  );
}