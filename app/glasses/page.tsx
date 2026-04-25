"use client";
import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal, X, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";

// --- Types ---
interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  brand?: string | null;
  sku?: string;
  stockQuantity?: number;
  status?: string;
  genderCategory: string;
  category?: {
    name: string;
  };
  images?: {
    url: string;
    isPrimary: boolean;
  }[];
  reviews?: {
    rating: number;
  }[];
  isNew?: boolean;
}

// --- Mock Data ---
const FALLBACK_GLASSES_DATA: Product[] = [
  {
    id: "1",
    title: "Aviator Gold Classic",
    category: { name: "Sunglasses" },
    genderCategory: "ALL",
    price: 185,
    reviews: [{ rating: 5 }],
    images: [
      {
        url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600",
        isPrimary: true,
      },
    ],
    isNew: true,
  }
];

const GlassesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("New Arrivals");
  const [priceRange, setPriceRange] = useState<number>(300);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(FALLBACK_GLASSES_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  const [couponMessage, setCouponMessage] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/products?category=glass", {
          // cache: "no-store",
        });
        const data = await response.json(); 
        if (
          response.ok &&
          Array.isArray(data) &&
          data.length > 0
        ) {
          setProducts(data);
        } else {
          setProducts(FALLBACK_GLASSES_DATA);
        }
      } catch {
        setProducts(FALLBACK_GLASSES_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const allowed = ["ALL", "MALE", "FEMALE", "CHILDREN"];
    const present = new Set(products.map((p) => p.genderCategory));
    return allowed.filter((category) =>
      category === "ALL"
        ? true
        : present.has(category as Product["genderCategory"]),
    );
  }, [products]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products].filter((p) => p.price <= priceRange);

    if (activeCategory !== "ALL") {
      result = result.filter((p) => p.genderCategory === activeCategory);
    }

    if (sortBy === "Price: Low to High")
      result.sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low")
      result.sort((a, b) => b.price - a.price);

    return result;
  }, [activeCategory, sortBy, priceRange, products]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* --- Sidebar Filters (Desktop) --- */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-10">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                  <Filter size={14} className="text-[#FFA500]" /> Categories
                </h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`group flex items-center justify-between w-full text-left text-sm font-semibold transition-all ${
                        activeCategory === cat
                          ? "text-[#FFA500]"
                          : "text-gray-500 hover:text-slate-900"
                      }`}
                    >
                      {cat}
                      <span
                        className={`h-1.5 w-1.5 rounded-full bg-[#FFA500] transition-opacity ${activeCategory === cat ? "opacity-100" : "opacity-0"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
                  Price Ceiling: ${priceRange}
                </h3>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#FFA500]"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-3 uppercase tracking-tighter">
                  <span>Min $50</span>
                  <span>Max $500</span>
                </div>
              </div>

              {/* <div className="p-6 bg-linear-to-br from-[#FFA500] to-[#FFD700] rounded-2xl text-white">
                <h4 className="font-bold mb-2">Summer Sale</h4>
                <p className="text-xs opacity-90 mb-4">
                  Get 20% off on all polarized lenses.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText("SUNNY20");
                      setCouponMessage("Coupon copied: SUNNY20");
                    } catch {
                      setCouponMessage("Use code SUNNY20 at checkout");
                    }
                  }}
                  className="text-[10px] font-black uppercase bg-white text-orange-600 px-4 py-2 rounded-lg"
                >
                  Apply Code: SUNNY20
                </button>
                {couponMessage ? (
                  <p className="mt-2 text-[10px] font-semibold">
                    {couponMessage}
                  </p>
                ) : null}
              </div> */}
            </div>
          </aside>

          {/* --- Product Grid Area --- */}
          <div className="flex-1">
            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>
                <p className="text-sm font-medium text-gray-500">
                  Showing{" "}
                  <span className="text-slate-900 font-bold">
                    {filteredProducts.length}
                  </span>{" "}
                  results
                </p>
              </div>

              <div className="relative inline-block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 text-xs font-black uppercase tracking-widest rounded-xl pl-5 pr-12 py-3 focus:ring-2 focus:ring-[#FFA500] focus:border-transparent outline-none cursor-pointer shadow-sm"
                >
                  <option>New Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Best Sellers</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                />
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="py-32 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">Loading glasses...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">
                  No styles found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("ALL");
                    setPriceRange(500);
                  }}
                  className="mt-4 text-[#FFA500] font-bold text-sm hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* Pagination / Load More */}
            <div className="mt-20 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 6)}
                disabled={visibleCount >= filteredProducts.length}
                className="group relative px-12 py-4 font-black uppercase tracking-widest hover:bg-slate-900 text-sm overflow-hidden rounded-xl border-2 border-slate-900 transition-all duration-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 w-0 hover:text-white bg-white transition-all duration-300 group-hover:w-full -z-10" />
                Load More Styles
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* --- Mobile Filter Drawer --- */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-[2.5rem] p-8 animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black">Refine Search</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8 pb-10">
              <div>
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">
                  Collection
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeCategory === cat
                          ? "bg-[#FFA500] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">
                  Max Price: Rs {priceRange}
                </h3>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#FFA500]"
                />
              </div>

              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlassesPage;
