"use client";

import { Search } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  activeCategory: string;
  setActiveCategory: (value: string) => void;
}

const  categories = ["All", "Women", "Men", "Western", "Footwear", "Kids", "Bags", "Electronics", "Grocery", "Beauty"];;

export default function Navbar({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}: NavbarProps) {
  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Logo */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
  <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
    <span className="text-orange-400 font-black text-sm">D</span>
  </div>
  <h1 className="text-xl font-bold tracking-tight text-gray-900">
    Deal<span className="text-orange-500">Hive</span>
  </h1>
</div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brands or products..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-100 border border-transparent focus:border-orange-400 focus:bg-white focus:outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}