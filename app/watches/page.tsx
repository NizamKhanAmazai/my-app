"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  ShoppingBag,
  ChevronDown, 
  SlidersHorizontal,
  X, 
  Loader2,
} from "lucide-react"; 
import ProductCard from "@/components/product/ProductCard";

// --- Types ---
interface Watch {
  id: string;
  title: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  brand?: string | null;
  sku?: string;
  productAttributes?: {
    name: string;
    value: string;
  }[];
  stockQuantity?: number;
  status?: string; 
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
 

const WatchesPage: React.FC = () => {
  const [watchData, setWatchData] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("New Arrivals");
  const [priceRange, setPriceRange] = useState<number>(1000000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false); 

  useEffect(() => {
    const fetchWatches = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products?category=watch");
        if (!response.ok) throw new Error("Failed to fetch watches");
        const data = await response.json();

        console.log(data)
        // set it at last
        setWatchData(data.products);

        // Find max price for initial range
        if (data.length > 0) {
          const max = Math.max(...data.map((p: Watch) => p.price));
          setPriceRange(max + 20000);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWatches();
  }, []);

  // Filter and Sort Logic
  // const filteredProducts = useMemo(() => {
  //   let result = [...watchData].filter((p) => p.price <= priceRange);

  //   if (activeCategory !== "all") {
  //     let mappedCategory = activeCategory.toUpperCase();
  //     if (activeCategory === "male") mappedCategory = "male";
  //     if (activeCategory === "female") mappedCategory = "female";
  //     if (activeCategory === "children") mappedCategory = "children";
  //     if (activeCategory === "all") mappedCategory = "unisex";

  //     //change it 
  //     console.log(result)
  //     result = result.filter((p) => p.genderCategory === mappedCategory);
  //   }

  //   if (sortBy === "Price: Low to High")
  //     result.sort((a, b) => a.price - b.price);
  //   if (sortBy === "Price: High to Low")
  //     result.sort((a, b) => b.price - a.price);

  //   return result;
  // }, [watchData, activeCategory, sortBy, priceRange]);

  // fix version 
  const filteredProducts = useMemo(() => {
  let result = [...watchData].filter(
    (p) => p.status === "ACTIVE" && p.price <= priceRange
  );

  // CATEGORY / GENDER FILTER
  if (activeCategory !== "all") {
    let mappedCategory = activeCategory.toLowerCase();

    if (mappedCategory === "male") mappedCategory = "men";
    if (mappedCategory === "female") mappedCategory = "women";
    if (mappedCategory === "children") mappedCategory = "children";
    if (mappedCategory === "all") mappedCategory = "unisex";

    result = result.filter((p) => {
      const genderAttr = p.productAttributes?.find(
        (attr) => attr.name.toLowerCase() === "gender"
      );

      if (!genderAttr) return false;

      return genderAttr.value.toLowerCase() === mappedCategory;
    });
  }

  // SORTING
  if (sortBy === "Price: Low to High") {
    result.sort((a, b) => a.price - b.price);
  }

  if (sortBy === "Price: High to Low") {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
}, [watchData, activeCategory, sortBy, priceRange]);

  // const handleAddToCart = (e: React.MouseEvent, product: Watch) => {
  //   e.stopPropagation();
  //   dispatch(
  //     addToCart({
  //       id: `${product.id}-default`,
  //       productId: product.id,
  //       title: product.name,
  //       price: product.price,
  //       discountPrice: null,
  //       image: product.image,
  //       quantity: 1,
  //       stockQuantity: 10, // Default fallback
  //       sku: `W-${product.id}`,
  //       description: "Elegant timepiece",
  //     }),
  //   );
  // };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-[#FFA500] animate-spin mb-4" />
        <p className="text-gray-500 font-medium font-sans">
          Discovering finest timepieces...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="bg-red-50 p-8 rounded-3xl text-center max-w-md border border-red-100">
          <h2 className="text-2xl font-black text-red-600 mb-2">Oops!</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- Sidebar Filters (Desktop) --- */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {["all", "male", "female", "children"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeCategory === cat
                        ? "bg-[#FFA500] text-white font-bold"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
                Price Range
              </h3>
              <input
                type="range"
                min="0"
                max="10000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFA500]"
              />
              <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
                <span>Rs 0</span>
                <span>Max: Rs {priceRange}</span>
              </div>
            </div>
          </aside>

          {/* --- Product Area --- */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-100">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg font-bold text-sm"
              >
                <SlidersHorizontal size={16} /> Filters
              </button>

              <p className="text-sm text-gray-500 font-medium">
                Showing{" "}
                <span className="text-slate-900">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>

              <div className="flex items-center gap-4">
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 text-sm font-bold rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFA500] transition-all"
                  >
                    <option>New Arrivals</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="inline-flex p-4 rounded-full bg-gray-50 mb-4">
                  <ShoppingBag size={48} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold">No watches found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters or price range.
                </p>
              </div>
            )}

            {/* Pagination placeholder */}
            <div className="mt-16 flex justify-center">
              <button className="px-8 py-3 rounded-full border-2 border-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-all active:scale-95">
                Load More Products
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* --- Mobile Filter Drawer --- */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase tracking-tight">
                Filters
              </h2>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X />
              </button>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">
                  Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["all", "male", "female", "children" ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                        activeCategory === cat
                          ? "bg-[#FFA500] border-[#FFA500] text-white"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">
                  Price Limit: Rs {priceRange}
                </h3>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#FFA500]"
                />
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-10"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchesPage;
