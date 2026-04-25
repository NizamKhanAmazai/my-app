"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  RotateCcw,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ProductCard from "@/components/product/ProductCard";

/** * Utility for Tailwind classes  */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Product = {
  id: string;
  title: string;
  price: number;
  discountPrice: number | null;
  brand: string | null;
  category: {
    name: string;
  };
  images: {
    url: string;
    isPrimary: boolean;
  }[];
  reviews: {
    rating: number;
  }[];
};

// --- Components ---

const LoadingSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-200 aspect-4/5 rounded-3xl mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    ))}
  </div>
);

export default function SearchResultsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState<Product[]>([]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = new URL("/api/products/search", window.location.origin);
        if (debouncedQuery) url.searchParams.append("query", debouncedQuery);
        if (category && category !== "All")
          url.searchParams.append("category", category);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedQuery, category]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      return 0; // "newest" is handled by API default order
    });
  }, [products, sortBy]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-orange-100 mt-20">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-orange-100/40 blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-yellow-100/30 blur-[100px]" />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-20 z-40 w-full border-b border-gray-100 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search premium eyewear & timepieces..."
                className="w-full pl-11 bg-gray-800 pr-4 py-3  border-none rounded-2xl focus:ring-2 focus:ring-orange-200 transition-all text-sm outline-none text-white placeholder:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Desktop Sort Dropdown */}
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <select
                  className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all"
              >
                <SlidersHorizontal className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 space-y-10 sticky top-44 h-fit">
            <section>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">
                Collections
              </h4>
              <div className="space-y-1.5">
                {["All", "Glasses", "Watches"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat === "All" ? null : cat)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-2xl text-sm transition-all duration-300",
                      category === cat || (cat === "All" && !category)
                        ? "bg-linear-to-r from-orange-400 to-yellow-400 text-white font-medium shadow-lg shadow-orange-200/50"
                        : "text-gray-600 hover:bg-white hover:shadow-sm",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">
                About the Curation
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Every piece in our collection is hand-vetted for quality,
                design, and timeless appeal. Search across our entire catalog of
                premium items.
              </p>
            </section>
          </aside>

          {/* Product Grid Area */}
          <section className="flex-1">
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="text-3xl font-light tracking-tight text-gray-900">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : "The Curated List"}
                <span className="ml-4 text-xs font-bold uppercase tracking-widest text-gray-300">
                  {products.length} items
                </span>
              </h2>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-12">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-orange-300" />
                </div>
                <h3 className="text-xl font-medium mb-2">No matching pieces</h3>
                <p className="text-gray-500 max-w-xs mb-8 text-sm">
                  Our artisans couldn't find a match. Refine your search or
                  explore the full collection.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCategory(null);
                  }}
                  className="flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 active:scale-95 transition-all text-sm font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-60 lg:hidden transition-all duration-500",
          isSidebarOpen ? "visible" : "invisible",
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500",
            isSidebarOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setIsSidebarOpen(false)}
        />
        {/* Drawer Content */}
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white p-8 transition-transform duration-500 ease-out",
            isSidebarOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-light">Filters</h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-10">
            <div className="space-y-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Select Category
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["All", "Glasses", "Watches"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat === "All" ? null : cat);
                    }}
                    className={cn(
                      "px-4 py-4 rounded-2xl border text-sm transition-all duration-300 font-medium",
                      category === cat || (cat === "All" && !category)
                        ? "border-orange-400 bg-orange-50 text-orange-600 ring-1 ring-orange-400"
                        : "border-gray-100 text-gray-600",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="w-full py-5 bg-linear-to-r from-orange-400 to-yellow-500 text-white rounded-2xl font-bold shadow-xl shadow-orange-200 transition-transform active:scale-[0.98]"
            >
              Show Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
