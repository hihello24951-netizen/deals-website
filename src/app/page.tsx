"use client";

import { useState, useMemo, useEffect, useDeferredValue } from "react";
import Navbar from "@/components/Navbar";
import BrandGrid from "@/components/BrandGrid";
import ProductCard from "@/components/ProductCard";
import brandsData from "../../data/brands.json";
import { Brand, Deal } from "@/types";

const brands = brandsData as Brand[];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [liveDeals, setLiveDeals] = useState<Deal[] | null>(null);
  const [loadingLive, setLoadingLive] = useState(true);

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
  const liveBrandIds = useMemo(() => new Set(deals.map((d) => d.brandId)), [deals]);
  const visibleBrands = useMemo(() => brands.filter((b) => liveBrandIds.has(b.id)), [liveBrandIds]);
  
  const brandMap = useMemo(() => {
    const map: Record<string, Brand> = {};
    brands.forEach((b) => (map[b.id] = b));
    return map;
  }, []);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesCategory = activeCategory === "All" || deal.category === activeCategory;
      const matchesBrand = !selectedBrandId || deal.brandId === selectedBrandId;
      const matchesSearch =
        deferredSearchQuery.trim() === "" ||
        deal.title.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
        deal.brandName.toLowerCase().includes(deferredSearchQuery.toLowerCase());

      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [deals, activeCategory, selectedBrandId, deferredSearchQuery]);

  // Design Trick: Split your deals dynamically to create an asymmetric "Bento" showcase at the top
  const { heroDeals, standardDeals } = useMemo(() => {
    if (selectedBrandId || deferredSearchQuery.trim() !== "" || activeCategory !== "All") {
      return { heroDeals: [], standardDeals: filteredDeals };
    }
    return {
      heroDeals: filteredDeals.slice(0, 2), // Pick top 2 as premium featured spots
      standardDeals: filteredDeals.slice(2),
    };
  }, [filteredDeals, selectedBrandId, deferredSearchQuery, activeCategory]);

  return (
    <main className="min-h-screen bg-canvas-base selection:bg-accent selection:text-white antialiased text-ink">
      {/* Decorative Premium Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(255,90,31,0.05),transparent_50%)] pointer-events-none" />

      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Brand Selector Section with a dedicated glass container */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <BrandGrid
          brands={visibleBrands}
          activeCategory={activeCategory}
          onBrandClick={setSelectedBrandId}
          selectedBrandId={selectedBrandId}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Dynamic Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-glass animate-card-reveal">
          <div>
            <p className="text-xs font-mono tracking-widest text-accent uppercase mb-1">
              {selectedBrandId ? "Brand Curation" : "Live Directory"}
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-ink">
              {selectedBrandId
                ? `Exclusives via ${brandMap[selectedBrandId]?.name}`
                : "The Editorial Feed"}
            </h2>
          </div>
          {!loadingLive && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-canvas-card border border-glass rounded-pill shadow-premium text-xs font-mono text-ink-light">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>{filteredDeals.length} Drops Active</span>
            </div>
          )}
        </div>

        {/* Loading State Skeleton Grid */}
        {loadingLive ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-72 w-full bg-canvas-card border border-glass rounded-card animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.03] to-transparent -translate-x-full animate-shimmer" />
              </div>
            ))}
          </div>
        ) : filteredDeals.length === 0 ? (
          /* Empty State reimagined as an elegant informational module */
          <div className="text-center py-24 bg-canvas-card border border-glass rounded-card shadow-premium max-w-xl mx-auto animate-card-reveal">
            <span className="inline-block text-2xl mb-3">🔍</span>
            <p className="text-ink font-display font-medium text-lg mb-1">No matches found</p>
            <p className="text-ink-light text-sm max-w-xs mx-auto">
              We couldn't locate active configurations matching your criteria. Try adjusting your scope.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 1. THE FEATURED BENTO BLOCK (Only renders during initial discovery state) */}
            {heroDeals.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-card-reveal">
                {/* Asymmetric Wide Featured Card Slot */}
                <div className="md:col-span-2 group relative overflow-hidden bg-ink text-white rounded-card p-8 md:p-12 flex flex-col justify-between shadow-premium hover:shadow-premium-hover transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(255,90,31,0.15),transparent_60%)] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                  <div>
                    <span className="inline-block px-3 py-1 bg-accent/20 border border-accent/30 text-accent font-mono text-xs uppercase rounded-pill mb-6">
                      Deal of the Hour
                    </span>
                    <h3 className="text-2xl md:text-4xl font-display font-bold tracking-tight max-w-md leading-tight mb-2">
                      {heroDeals[0].title}
                    </h3>
                    <p className="text-slate-400 font-sans text-sm">{heroDeals[0].brandName}</p>
                  </div>
                  <div className="mt-8 md:mt-0">
                    <ProductCard deal={heroDeals[0]} isFeaturedVariant={true} />
                  </div>
                </div>

                {/* Secondary Featured Slot */}
                <div className="bg-canvas-card border border-glass rounded-card p-8 flex flex-col justify-between shadow-premium hover:shadow-premium-hover transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <div>
                    <span className="inline-block px-3 py-1 bg-ink/5 border border-glass text-ink-light font-mono text-xs uppercase rounded-pill mb-6">
                      Trending High Priority
                    </span>
                    <h3 className="text-xl font-display font-bold text-ink leading-snug mb-1">
                      {heroDeals[1].title}
                    </h3>
                    <p className="text-ink-light text-sm">{heroDeals[1].brandName}</p>
                  </div>
                  <div className="mt-6">
                    <ProductCard deal={heroDeals[1]} />
                  </div>
                </div>
              </div>
            )}

            {/* 2. THE EDITORIAL GRID OVERVIEW */}
            {standardDeals.length > 0 && (
              <div className="space-y-6">
                {heroDeals.length > 0 && (
                  <h3 className="text-xs font-mono tracking-widest text-ink-light uppercase">
                    More Curated Offers
                  </h3>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-card-reveal [animation-delay:150ms]">
                  {standardDeals.map((deal) => (
                    <ProductCard key={deal.id} deal={deal} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}