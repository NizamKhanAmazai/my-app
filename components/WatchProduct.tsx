'use client';
import React, { useState } from 'react';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Minus, 
  Plus, 
  ChevronRight,
  Maximize2,
  CheckCircle2
} from 'lucide-react';

// --- Types ---
interface ProductImage {
  url: string;
  alt: string;
}

interface Specification {
  label: string;
  value: string;
}

// --- Mock Data ---
const PRODUCT = {
  id: "w-102",
  name: "Horizon Chrono Gold Edition",
  brand: "LUXORA",
  collection: "The Prestige Series",
  price: 450,
  originalPrice: 599,
  rating: 4.9,
  reviewCount: 128,
  stockStatus: "Limited Stock",
  tagline: "Precision meets opulence in every second.",
  description: "Crafted for those who command attention, the Horizon Chrono features a brushed 18k gold-plated stainless steel case paired with a scratch-resistant sapphire crystal. Engineered with a high-precision Swiss movement, it blends timeless aesthetics with modern durability.",
  features: ["Waterproof up to 100m", "Scratch-resistant Sapphire", "Luminous Hands", "Swiss Quartz Movement"],
  specs: [
    { label: "Case Material", value: "18k Gold Plated Stainless Steel" },
    { label: "Movement", value: "Swiss Ronda 5030.D Quartz" },
    { label: "Case Size", value: "42mm" },
    { label: "Strap", value: "Genuine Italian Leather" },
    { label: "Water Resistance", value: "10 ATM (100 meters)" },
    { label: "Weight", value: "156g" }
  ],
  images: [
    { url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800", alt: "Main Front View" },
    { url: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800", alt: "Side Profile" },
    { url: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800", alt: "Lifestyle Shot" },
    { url: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&q=80&w=800", alt: "Macro Detail" }
  ],
  colors: [
    { name: 'Gold', class: 'bg-[#FFD700]' },
    { name: 'Silver', class: 'bg-slate-300' },
    { name: 'Midnight', class: 'bg-slate-900' }
  ]
};

const RELATED_PRODUCTS = [
  { id: 1, name: "Aviator Gold Sun", price: 185, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Stealth Black Watch", price: 320, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Clear Frame Optical", price: 110, image: "https://images.unsplash.com/photo-1511499767390-90342f568952?auto=format&fit=crop&q=80&w=400" },
];

const ProductDetailPage: React.FC = () => {
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');
  const [selectedColor, setSelectedColor] = useState('Gold');

  function openImage (url: string) {
    window.open(url, '_blank');
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Breadcrumbs --- */}
        <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
          <a href="/" className="hover:text-[#FFA500]">Home</a>
          <ChevronRight size={12} />
          <a href="/watches" className="hover:text-[#FFA500]">Watches</a>
          <ChevronRight size={12} />
          <span className="text-slate-900">{PRODUCT.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
          
          {/* --- LEFT: Image Gallery --- */}
          <div className="w-full lg:w-3/5 space-y-4">
            <div className="relative aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden group cursor-zoom-in">
              <img 
                src={PRODUCT.images[selectedImg].url} 
                alt={PRODUCT.images[selectedImg].alt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <button className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-[#FFA500] hover:text-white transition-colors"
                onClick={()=> openImage("https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800")}
              >
                <Maximize2 size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {PRODUCT.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImg === idx ? 'border-[#FFA500]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT: Product Info --- */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#FFA500] font-black text-xs uppercase tracking-[0.2em]">{PRODUCT.brand}</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{PRODUCT.collection}</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight">{PRODUCT.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < 4.5 ? "fill-[#FFD700] text-[#FFD700]" : "text-gray-200"} />
                  ))}
                  <span className="ml-2 text-sm font-black text-orange-700">{PRODUCT.rating}</span>
                </div>
                <span className="text-gray-400 text-sm font-medium underline underline-offset-4 cursor-pointer hover:text-[#FFA500]">
                  {PRODUCT.reviewCount} Verified Reviews
                </span>
              </div>
            </div>

            <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-black text-slate-900">${PRODUCT.price}</span>
                <span className="text-lg text-gray-400 line-through mb-1">${PRODUCT.originalPrice}</span>
                <span className="bg-[#FFA500] text-white text-[10px] font-black px-2 py-1 rounded mb-2 ml-1">SAVE 25%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-600 font-bold">{PRODUCT.stockStatus}</span>
              </div>
            </div>

            {/* --- Variants & Quantity --- */}
            <div className="space-y-8 mb-10">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Select Finish: {selectedColor}</label>
                <div className="flex gap-3">
                  {PRODUCT.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full p-1 border-2 transition-all ${
                        selectedColor === color.name ? 'border-[#FFA500] scale-110' : 'border-transparent'
                      }`}
                    >
                      <div className={`w-full h-full rounded-full ${color.class}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Quantity</label>
                  <div className="flex items-center bg-white border-2 border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Action Buttons --- */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-[0.1em] transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button className="px-6 py-5 border-2 border-slate-100 hover:border-[#FFA500] rounded-2xl transition-all group active:scale-[0.98]">
                <Heart size={24} className="group-hover:text-red-500 group-hover:fill-red-500 transition-colors" />
              </button>
            </div>

            {/* --- Trust Badges --- */}
            <div className="grid grid-cols-3 gap-4 py-8 border-y border-slate-100">
              <div className="text-center">
                <Truck size={20} className="mx-auto text-[#FFA500] mb-2" />
                <p className="text-[10px] font-black uppercase text-gray-500">Free Express Shipping</p>
              </div>
              <div className="text-center border-x border-slate-100">
                <ShieldCheck size={20} className="mx-auto text-[#FFA500] mb-2" />
                <p className="text-[10px] font-black uppercase text-gray-500">2 Year Warranty</p>
              </div>
              <div className="text-center">
                <RotateCcw size={20} className="mx-auto text-[#FFA500] mb-2" />
                <p className="text-[10px] font-black uppercase text-gray-500">30 Day Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- TABS SECTION --- */}
        <div className="mt-24 border-t border-slate-100 pt-16">
          <div className="flex justify-center space-x-12 mb-12">
            {['details', 'specs', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`text-sm font-black uppercase tracking-[0.2em] pb-4 border-b-2 transition-all ${
                  activeTab === tab ? 'border-[#FFA500] text-slate-900' : 'border-transparent text-gray-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto min-h-[300px]">
            {activeTab === 'details' && (
              <div className="grid md:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-slate-900">{PRODUCT.tagline}</h3>
                  <p className="text-gray-500 leading-relaxed">{PRODUCT.description}</p>
                  <ul className="space-y-3">
                    {PRODUCT.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm font-bold">
                        <CheckCircle2 size={18} className="text-[#FFA500]" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                   <img src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600" alt="Detail view" />
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 animate-in fade-in duration-500">
                {PRODUCT.specs.map(spec => (
                  <div key={spec.label} className="flex justify-between py-4 border-b border-slate-100">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">{spec.label}</span>
                    <span className="text-sm font-bold text-slate-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-slate-50 p-8 rounded-3xl">
                  <h4 className="font-black text-lg mb-4">Estimated Delivery</h4>
                  <p className="text-gray-600 mb-2">United States: <span className="font-bold text-slate-900">2-4 Business Days</span></p>
                  <p className="text-gray-600">International: <span className="font-bold text-slate-900">7-10 Business Days</span></p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                   <div>
                      <h4 className="font-black text-sm uppercase tracking-widest mb-3">Return Policy</h4>
                      <p className="text-sm text-gray-500">Items must be returned within 30 days in original packaging and unworn condition.</p>
                   </div>
                   <div>
                      <h4 className="font-black text-sm uppercase tracking-widest mb-3">Packaging</h4>
                      <p className="text-sm text-gray-500">Every order comes in a signature LUXORA vegan leather box with a cleaning kit.</p>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- RELATED PRODUCTS --- */}
        <section className="mt-32 pt-20 border-t border-slate-100">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-2">You May Also Like</h2>
              <div className="h-1.5 w-20 bg-[#FFA500]" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {RELATED_PRODUCTS.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 mb-6">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="font-black text-[#FFA500]">${item.price}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetailPage;