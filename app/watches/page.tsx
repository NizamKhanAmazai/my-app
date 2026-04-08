'use client';
import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  ChevronDown, 
  Filter, 
  Star, 
  LayoutGrid, 
  List, 
  SlidersHorizontal,
  X,
  Plus
} from 'lucide-react'; 
import { useRouter } from 'next/navigation';

// --- Types ---
interface Watch {
  id: number;
  name: string;
  category: 'Men' | 'Women' | 'Smartwatch' | 'Luxury';
  price: number;
  rating: number;
  reviews: number;
  image: string;
  isNew?: boolean;
}

// --- Mock Data ---
const WATCH_DATA: Watch[] = [
  { id: 1, name: "Summit Silver Chrono", category: "Luxury", price: 549, rating: 4.8, reviews: 124, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600", isNew: true },
  { id: 2, name: "Active Pro Smart v2", category: "Smartwatch", price: 199, rating: 4.5, reviews: 89, image: "https://images.unsplash.com/photo-1508685096489-7aac29145fe4?auto=format&fit=crop&q=80&w=600" },
  { id: 3, name: "Rose Gold Elegance", category: "Women", price: 280, rating: 4.9, reviews: 56, image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&q=80&w=600" },
  { id: 4, name: "Midnight Diver 300", category: "Men", price: 420, rating: 4.7, reviews: 210, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600" },
  { id: 5, name: "Solar Titanium", category: "Luxury", price: 850, rating: 5.0, reviews: 34, image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=600", isNew: true },
  { id: 6, name: "Classic Leather Date", category: "Men", price: 150, rating: 4.4, reviews: 142, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600" },
];

const WatchesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('New Arrivals');
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const router = useRouter();

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...WATCH_DATA].filter(p => p.price <= priceRange);
    
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    
    return result;
  }, [activeCategory, sortBy, priceRange]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-20">
      
      {/* --- Page Header --- */}
      {/* <header className="bg-gray-50 border-b border-gray-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA500] to-[#FFD700]">Watches</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            From precision chronographs to minimalist designs, find the perfect timepiece that reflects your journey.
          </p>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- Sidebar Filters (Desktop) --- */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Categories</h3>
              <div className="space-y-2">
                {['All', 'Men', 'Women', 'Smartwatch', 'Luxury'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeCategory === cat 
                      ? 'bg-[#FFA500] text-white font-bold' 
                      : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Price Range</h3>
              <input 
                type="range" 
                min="0" 
                max="1000" 
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFA500]"
              />
              <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
                <span>$0</span>
                <span>Max: ${priceRange}</span>
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
                Showing <span className="text-slate-900">{filteredProducts.length}</span> products
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
                    <option>Best Sellers</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                  onClick={()=> router.push(`/product/watch`)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.isNew && (
                        <span className="absolute top-4 left-4 bg-[#FFA500] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-orange-200">
                          New
                        </span>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900 text-lg">{product.name}</h3>
                      </div>

                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < Math.floor(product.rating) ? "fill-[#FFD700] text-[#FFD700]" : "text-gray-200"} 
                          />
                        ))}
                        <span className="text-xs text-gray-400 font-medium ml-1">({product.reviews})</span>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-2xl font-black text-slate-900">${product.price}</span>
                        <button className="flex items-center gap-2 bg-slate-900 hover:bg-[#FFA500] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 active:scale-95 group/btn">
                          <Plus size={16} className="group-hover/btn:rotate-90 transition-transform" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}  
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="inline-flex p-4 rounded-full bg-gray-50 mb-4">
                  <ShoppingBag size={48} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold">No watches found</h3>
                <p className="text-gray-500">Try adjusting your filters or price range.</p>
              </div>
            )}

            {/* Pagination */}
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase tracking-tight">Filters</h2>
              <button onClick={() => setIsMobileFilterOpen(false)}><X /></button>
            </div>
            {/* Filter Content Re-used */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Men', 'Women', 'Smartwatch', 'Luxury'].map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                        activeCategory === cat 
                        ? 'bg-[#FFA500] border-[#FFA500] text-white' 
                        : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Price Limit: ${priceRange}</h3>
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
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