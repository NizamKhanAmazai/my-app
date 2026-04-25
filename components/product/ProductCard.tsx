"use client";

import React, { useState, useMemo } from "react";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";

/** * Utility for Tailwind classes  */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Product Type Definition

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
  rating: number;
};

const ProductCard = ({ product }: { product: Product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const userdata = useAppSelector((state) => state.user.user);

  // console.log(product);
  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400";

  const avgRating = product.rating 

  const wishlistedItem = async (productId: string) => {
    if (!userdata?.id) {
      alert("login for permanently save items");
      return;
    }
    if (!productId) {
      alert("product not found!");
      return;
    }
    try {
      const res = await fetch("/api/products/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setIsWishlisted(!isWishlisted);
      return data;
    } catch (error: any) {
      // setIsWishlisted(!isWishlisted);
      console.error("Wishlist error:", error.message);
      throw error;
    }
  };

  return (
    <div className="group relative animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      {/* Image Container */}
      <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-gray-100 mb-4 transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-orange-200/50">
        <img
          src={primaryImage}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Wishlist Button */}
        <button
          onClick={() => wishlistedItem(product.id)}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white active:scale-90"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isWishlisted
                ? "fill-orange-500 stroke-orange-500"
                : "text-gray-600",
            )}
          />
        </button>

        {/* Hover View Details Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-500 group-hover:translate-y-0">
          <Link
            href={`/product/${product.id}`}
            className="w-full py-3 bg-white/95 backdrop-blur-md text-gray-900 rounded-xl font-medium shadow-lg flex items-center justify-center gap-2 hover:bg-white active:scale-95 transition-all text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            View Details
          </Link>
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-1 px-1">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-900 truncate pr-2">
            {product.title}
          </h3>
          <p className="text-sm font-bold text-gray-900">
            Rs {product.discountPrice || product.price}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            {product.brand || product.category.name}
          </p>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center text-yellow-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-[10px] ml-0.5 font-bold">{avgRating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
