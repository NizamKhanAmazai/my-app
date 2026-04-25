"use client";
import React, { useState } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Truck, 
  Minus,
  Plus,
  Maximize2,
  CheckCircle2, 
  Eye, 
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// --- Types ---
export interface ProductImage {
  url: string;
  alt: string;
}

export interface GlassesProductData {
  id: string;
  name: string;
  brand: string | null;
  collection: string | null;
  tagline: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stockStatus: string;
  description: string;
  features: string[];
  specs: {
    frameMaterial: string;
    lensType: string;
    dimensions: string;
    weight: string;
  };
  images: ProductImage[];
  colors: { name: string; hex: string }[];
}

const GlassesProductDetail: React.FC<{
  productData: GlassesProductData;
  relatedProducts?: any[];
}> = ({ productData, relatedProducts = [] }) => {
  const GLASSES = productData;
  const [mainImage, setMainImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"info" | "specs" | "care">("info");
  const [selectedColor, setSelectedColor] = useState(
    GLASSES.colors[0]?.name || "Default",
  );
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased pb-20">
      {/* Navigation Space Holder */}
      <div className="h-20" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          {/* --- Left: Image Gallery --- */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="relative aspect-4/5 bg-gray-50 rounded-3xl overflow-hidden group">
              <img
                src={GLASSES.images[mainImage].url}
                alt={GLASSES.images[mainImage].alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <button
                  onClick={() => router.push("/face-test")}
                  className="p-3 bg-white/90 backdrop-blur rounded-full shadow-xl hover:bg-[#FFA500] hover:text-white transition-all"
                >
                  <Maximize2 size={20} />
                </button>
              </div>
              <div className="absolute bottom-6 left-6">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900/80 backdrop-blur-md text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#FFA500] transition-colors">
                  <Eye size={16} /> View Gallery
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {GLASSES.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    mainImage === idx
                      ? "border-[#FFA500] scale-95 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* --- Right: Product Content --- */}
          <div className="w-full lg:w-1/2">
            <div className="mb-8">
              <p className="text-[#FFA500] font-black text-xs uppercase tracking-[0.3em] mb-2">
                {GLASSES.brand} — {GLASSES.collection}
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                {GLASSES.name}
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < 4
                          ? "fill-[#FFD700] text-[#FFD700]"
                          : "text-gray-200"
                      }
                    />
                  ))}
                  <span className="ml-2 text-sm font-black text-slate-800">
                    {GLASSES.rating}
                  </span>
                </div>
                <span className="text-gray-400 text-sm font-bold uppercase tracking-widest border-l pl-6 border-gray-200">
                  {GLASSES.reviewCount} Reviews
                </span>
              </div>
            </div>

            <p className="text-lg font-bold text-[#FFA500] italic mb-6">
              "{GLASSES.tagline}"
            </p>

            <div className="mb-10 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-black text-slate-900">
                  Rs {GLASSES.price}
                </span>
                {GLASSES.originalPrice && (
                  <span className="text-xl text-gray-400 line-through font-medium">
                    Rs {GLASSES.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${GLASSES.stockStatus === "In Stock" ? "bg-green-500" : "bg-orange-500"}`}
                />
                <span
                  className={`text-xs font-black uppercase tracking-widest ${GLASSES.stockStatus === "In Stock" ? "text-green-600" : "text-orange-600"}`}
                >
                  {GLASSES.stockStatus}
                </span>
              </div>
            </div>

            {/* --- Options --- */}
            <div className="space-y-8 mb-10">
              {/* <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                  Frame Finish: {selectedColor}
                </label>
                <div className="flex gap-4">
                  {GLASSES.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-12 h-12 rounded-full p-1 border-2 transition-all duration-300 ${
                        selectedColor === color.name
                          ? "border-[#FFA500] scale-110 shadow-lg"
                          : "border-transparent hover:border-gray-200"
                      }`}
                    >
                      <div
                        className="w-full h-full rounded-full border border-black/5"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>  */}

              <div className="flex flex-col sm:flex-row gap-8">
                <div className="w-full sm:w-1/3">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                    Quantity
                  </label>
                  <div className="flex items-center justify-between bg-white border-2 border-gray-100 rounded-2xl p-2 px-4 shadow-sm">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-1 hover:text-[#FFA500]"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-black text-lg">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="p-1 hover:text-[#FFA500]"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div className="w-full sm:w-2/3">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                    Lens Option
                  </label>
                  <select className="w-full bg-white border-2 border-gray-100 rounded-2xl p-3.5 text-sm font-bold focus:ring-2 focus:ring-[#FFA500] outline-none appearance-none">
                    <option>Non-Prescription (Standard)</option>
                    <option>Blue Light Filter (+ Rs 30.00)</option>
                    <option>Premium Polarized (+ Rs 50.00)</option>
                    <option>Prescription Ready (+ Rs 80.00)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* --- Buttons --- */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="flex-1 bg-[#FFA500] hover:bg-[#FFD700] hover:text-orange-900 text-white py-3 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-100 active:scale-[0.98] flex items-center justify-center gap-3">
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button className="px-8 py-3 border-2 border-gray-100 hover:border-red-500 hover:text-red-500 rounded-2xl transition-all group">
                <Heart
                  size={24}
                  className="group-hover:fill-red-500 transition-colors"
                />
              </button>
            </div>

            {/* --- Tabs & Details --- */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex gap-8 mb-8">
                {["info", "specs"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t as any)}
                    className={`text-xs font-black uppercase tracking-[0.2em] pb-2 border-b-2 transition-all ${
                      activeTab === t
                        ? "border-[#FFA500] text-slate-900"
                        : "border-transparent text-gray-400 hover:text-slate-600"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="min-h-30 text-sm leading-relaxed text-gray-500">
                {activeTab === "info" && (
                  <div className="animate-in fade-in duration-500">
                    <p className="mb-4">{GLASSES.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {GLASSES.features.map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-2 font-bold text-slate-800"
                        >
                          <CheckCircle2 size={14} className="text-[#FFA500]" />{" "}
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === "specs" && (
                  <div className="grid grid-cols-2 gap-y-4 animate-in fade-in duration-500">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">
                        Material
                      </p>
                      <p className="font-bold text-slate-800">
                        {GLASSES.specs.frameMaterial}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">
                        Lens Type
                      </p>
                      <p className="font-bold text-slate-800">
                        {GLASSES.specs.lensType}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">
                        Dimensions
                      </p>
                      <p className="font-bold text-slate-800">
                        {GLASSES.specs.dimensions}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">
                        Net Weight
                      </p>
                      <p className="font-bold text-slate-800">
                        {GLASSES.specs.weight}
                      </p>
                    </div>
                  </div>
                )}
                {/* {activeTab === "care" && (
                  <div className="animate-in fade-in duration-500 space-y-2">
                    <p>
                      • Use the provided microfiber cloth for daily cleaning.
                    </p>
                    <p>• Avoid using paper towels or household detergents.</p>
                    <p>
                      • Store in the provided hard-shell case when not in use.
                    </p>
                    <p>
                      • Rinse with lukewarm water to remove salt or sand
                      particles.
                    </p>
                  </div>
                )} */}
              </div>
            </div>

            {/* --- Shipping/Returns Info --- */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                <Truck size={20} className="text-[#FFA500] shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase">Fast Shipping</p>
                  <p className="text-[10px] text-gray-500">
                    Delivery in 2-4 business days.
                  </p>
                </div>
              </div>
              {/* <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                <ShieldCheck size={20} className="text-[#FFA500] shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase">
                    2-Year Warranty
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Protection against manufacturing defects.
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* --- Related Products Section --- */}
        <section className="mt-32 border-t border-gray-100 pt-1">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                You May Also Like
              </h2>
              <div className="h-1.5 w-24 bg-[#FFA500] mt-2 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((item, i) => (
              <div
                key={i}
                className="group cursor-pointer"
                onClick={() => router.push(`/product/${item.id}`)}
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 mb-6">
                  {item.images ? (
                    <Image
                      src={item.images?.[0]?.url || item.image || item.img}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      width={400}
                      height={400}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors" />
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xl group-hover:text-[#FFA500] transition-colors">
                    {item.title || item.name}
                  </h3>
                  <p className="font-black text-[#FFA500]">
                    Rs {item.discountPrice ?? item.price}
                  </p>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Polarized Series
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default GlassesProductDetail;
