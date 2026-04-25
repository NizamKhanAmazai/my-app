"use client"; 
import { ShoppingCart, Trash2, Star } from "lucide-react";
import { useEffect, useState } from "react";

 
interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  image: string;
  rating: number;
}

export default function WishlistGrid() {
  const [wishlist, setWishlist] = useState<Product[]>();
 const getWishlist = async () => {
    try {
      const res = await fetch("/api/products/wishlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // ensures fresh data
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch wishlist");
      }
      // the data comes with data: data: {products}
      setWishlist(data.data);

    } catch (error: any) {
      console.error("Get wishlist error:", error.message);
      throw error;
    }
  }

  const deleteWishlist = async (productId: string) => {
    try {
      const res = await fetch("/api/products/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message || "Failed to delete from wishlist");
        alert("failded to delete from wishlist")
        return;
      }
      // setWishlist([...wishlist?.filter((item) => item.id !== productId)])
      setWishlist((prev => prev?.filter((item) => item.id !== productId)))
    } catch (error: any) {
      console.error("Delete wishlist error:", error.message);
      throw error;
    }
  }

  useEffect(()=>{
    getWishlist();
  },[])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlist?.map((item) => (
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
            <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm" 
              onClick={()=>{deleteWishlist(item.id)}}
            >
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

            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors group-hover:bg-linear-to-r group-hover:from-[#FFA500] group-hover:to-[#FFD700]">
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
