"use client";

import { Search } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  activeCategory: string;
  setActiveCategory: (value: string) => void;
}

const categories = ["All", "Women", "Men", "Western", "Footwear", "Kids", "Bags", "Electronics", "Grocery", "Beauty"];

export default function Navbar({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}: NavbarProps) {
  return (
    <div className="sticky top-0 z-50 bg-canvas-card/80 backdrop-blur-xl border-b border-glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Tier 1: Identity & High-Performance Search bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-glass/40">
          
          {/* Logo Brand Frame */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-inner bg-ink flex items-center justify-center shadow-premium relative group overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-tr from-accent to-accent-hover opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="text-white font-display font-black text-base relative z-10">D</span>
            </div>
            <h1 className="text-xl font-display font-bold tracking-tight text-ink">
              Deal<span className="text-accent">Hive</span>
            </h1>
          </div>

          {/* Premium Immersive Input Field */}
          <div className="relative w-full sm:max-w-md group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-light/50 group-focus-within:text-accent transition-colors duration-300"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search premium curation fields..."
              className="w-full pl-11 pr-4 py-2.5 rounded-pill bg-canvas-base border border-glass/60 text-sm font-sans text-ink placeholder:text-ink-light/40 focus:bg-canvas-card focus:border-accent focus:shadow-glow focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Tier 2: Category Slider Track */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 -mb-[1px] no-scrollbar mask-inline-edges">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-pill text-xs font-mono tracking-wide transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform active:scale-95 ${
                  isActive
                    ? "bg-ink text-white shadow-premium"
                    : "bg-canvas-base border border-glass text-ink-light hover:text-ink hover:border-ink-light/30"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}