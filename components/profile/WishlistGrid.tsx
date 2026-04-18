"use client";
import { ShoppingCart, Trash2, Star } from "lucide-react";

const MOCK_WISHLIST = [
  {
    id: 101,
    name: "Midnight Cat-Eye Frames",
    price: 4500,
    discountPrice: 3200,
    image:
      "https://images.unsplash.com/photo-1511499767390-a8a19799ef81?q=80&w=300",
    rating: 4.8,
  },
  {
    id: 102,
    name: "Titanium Silver Aviators",
    price: 8900,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=300",
    rating: 4.9,
  },
];

export default function WishlistGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_WISHLIST.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-xl transition-all duration-300"
        >
          {/* Image Container */}
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
              <Trash2 size={18} />
            </button>
          </div>

          {/* Product Details */}
          <div className="p-4">
            <div className="flex items-center gap-1 mb-1">
              <Star size={12} className="fill-[#FFD700] text-[#FFD700]" />
              <span className="text-xs font-medium text-gray-500">
                {item.rating}
              </span>
            </div>
            <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-gray-900">
                Rs. {item.discountPrice || item.price}
              </span>
              {item.discountPrice && (
                <span className="text-sm text-gray-400 line-through">
                  Rs. {item.price}
                </span>
              )}
            </div>

            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors group-hover:bg-gradient-to-r group-hover:from-[#FFA500] group-hover:to-[#FFD700]">
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
