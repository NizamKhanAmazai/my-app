'use client';
import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  ChevronDown, 
  Star, 
  SlidersHorizontal,
  X,
  Plus,
  Eye,
  Filter
} from 'lucide-react'; 
import { useRouter } from 'next/navigation';

// --- Types ---
interface Product {
  id: number;
  name: string;
  category: 'Sunglasses' | 'Optical' | 'Men' | 'Women';
  price: number;
  rating: number;
  reviews: number;
  image: string;
  isTrending?: boolean;
}

// --- Mock Data ---
const GLASSES_DATA: Product[] = [
  { id: 1, name: "Aviator Gold Classic", category: "Sunglasses", price: 185, rating: 4.9, reviews: 120, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600", isTrending: true },
  { id: 2, name: "Urban Clear Frames", category: "Optical", price: 125, rating: 4.7, reviews: 85, image: "https://images.unsplash.com/photo-1511499767390-90342f568952?auto=format&fit=crop&q=80&w=600" },
  { id: 3, name: "Sahara Amber Sun", category: "Sunglasses", price: 210, rating: 4.8, reviews: 42, image: "https://images.unsplash.com/photo-1577803645773-f933d4109719?auto=format&fit=crop&q=80&w=600", isTrending: true },
  { id: 4, name: "Midnight Noir Square", category: "Women", price: 155, rating: 4.6, reviews: 93, image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600" },
  { id: 5, name: "Vintage Tortoise", category: "Men", price: 140, rating: 4.5, reviews: 67, image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600" },
  { id: 6, name: "Azure Blue Light", category: "Optical", price: 95, rating: 4.9, reviews: 210, image: "https://images.unsplash.com/photo-1591076482161-421a3b061ffa?auto=format&fit=crop&q=80&w=600" },
];

const GlassesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('New Arrivals');
  const [priceRange, setPriceRange] = useState<number>(300);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const router = useRouter();
  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...GLASSES_DATA].filter(p => p.price <= priceRange);
    
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    
    return result;
  }, [activeCategory, sortBy, priceRange]);

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-20">
      
      {/* --- Page Header --- */}
      {/* <header className="relative bg-slate-900 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 -left-20 w-72 h-72 bg-[#FFA500] rounded-full blur-[120px]" />
            <div className="absolute bottom-0 -right-20 w-72 h-72 bg-[#FFD700] rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
            Our <span className="text-[#FFA500]">Glasses</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Crystal clear vision meets high-end fashion. Discover our Italian-crafted collection.
          </p>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* --- Sidebar Filters (Desktop) --- */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-10">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                  <Filter size={14} className="text-[#FFA500]" /> Categories
                </h3>
                <div className="space-y-3">
                  {['All', 'Sunglasses', 'Optical', 'Men', 'Women'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`group flex items-center justify-between w-full text-left text-sm font-semibold transition-all ${
                        activeCategory === cat ? 'text-[#FFA500]' : 'text-gray-500 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                      <span className={`h-1.5 w-1.5 rounded-full bg-[#FFA500] transition-opacity ${activeCategory === cat ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Price Ceiling: ${priceRange}</h3>
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

              <div className="p-6 bg-gradient-to-br from-[#FFA500] to-[#FFD700] rounded-2xl text-white">
                <h4 className="font-bold mb-2">Summer Sale</h4>
                <p className="text-xs opacity-90 mb-4">Get 20% off on all polarized lenses.</p>
                <button className="text-[10px] font-black uppercase bg-white text-orange-600 px-4 py-2 rounded-lg">Apply Code: SUNNY20</button>
              </div>
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
                  Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> results
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
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group flex flex-col"
                  onClick={()=> router.push(`/product/${"glasses"}`)}
                  >
                    <div className="relative aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden mb-5">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Floating Action */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="bg-white p-3 rounded-full shadow-xl hover:bg-[#FFA500] hover:text-white transition-colors">
                           <Eye size={18} />
                        </button>
                        <button className="bg-white px-6 py-3 rounded-full shadow-xl font-bold text-sm hover:bg-[#FFA500] hover:text-white transition-colors">
                           Add to Cart
                        </button>
                      </div>

                      {product.isTrending && (
                        <div className="absolute top-5 right-5 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter text-[#FFA500] shadow-sm">
                          Trending
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-900 group-hover:text-[#FFA500] transition-colors">{product.name}</h3>
                        <span className="font-black text-lg">${product.price}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">{product.category}</p>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={i < Math.floor(product.rating) ? "fill-[#FFD700] text-[#FFD700]" : "text-gray-200"} 
                          />
                        ))}
                        <span className="text-[10px] text-gray-400 font-bold ml-1">{product.reviews} Reviews</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No styles found matching your criteria.</p>
                <button 
                    onClick={() => { setActiveCategory('All'); setPriceRange(500); }}
                    className="mt-4 text-[#FFA500] font-bold text-sm hover:underline"
                >
                    Reset all filters
                </button>
              </div>
            )}

            {/* Pagination / Load More */}
            <div className="mt-20 flex justify-center">
              <button className="group relative px-12 py-4 font-black uppercase tracking-widest text-sm overflow-hidden rounded-xl border-2 border-slate-900 transition-all duration-300 hover:text-white">
                <div className="absolute inset-0 w-0 bg-slate-900 transition-all duration-300 group-hover:w-full -z-10" />
                Load More Styles
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* --- Mobile Filter Drawer --- */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-[2.5rem] p-8 animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black">Refine Search</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="space-y-8 pb-10">
              <div>
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Collection</h3>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Sunglasses', 'Optical', 'Men', 'Women'].map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeCategory === cat 
                        ? 'bg-[#FFA500] text-white' 
                        : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Max Price: ${priceRange}</h3>
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