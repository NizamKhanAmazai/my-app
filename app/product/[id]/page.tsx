"use client";

import GlassesProductDetail from "@/components/GlassProduct";
import WatchProductDetail from "@/components/WatchProduct";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA500]" />
      </div>
    );
  }

  // Handle Legacy / Logic for hardcoded routes if any
  console.log(product);
  const isGlasses =
    id === "glasses" ||
    (product &&
      (product.category?.name?.toLowerCase().includes("glass") ||
        product.title?.toLowerCase().includes("glass")));
  const isWatch =
    id === "watch" ||
    (product &&
      (product.category?.name?.toLowerCase().includes("watch") ||
        product.title?.toLowerCase().includes("watch")));

  if (isGlasses) {
    const glassData = product
      ? {
          id: product.id,
          name: product.title,
          brand: product.brand || "LUXORA",
          collection: "New Arrival",
          tagline: product.description.slice(0, 50) + "...",
          price: product.price,
          originalPrice: product.discountPrice || undefined,
          rating:
            product.reviews?.length > 0
              ? product.reviews.reduce(
                  (acc: any, curr: any) => acc + curr.rating,
                  0,
                ) / product.reviews.length
              : 4.8,
          reviewCount: product.reviews?.length || 0,
          stockStatus: product.stockQuantity > 0 ? "In Stock" : "Out of Stock",
          description: product.description,
          features: [
            "100% UV Protection",
            "Scratch Resistant",
            "Premium Material",
          ],
          specs: {
            frameMaterial: "Premium Acetate",
            lensType: "Polarized",
            dimensions: "Standard",
            weight: "20g",
          },
          images:
            product.images.length > 0
              ? product.images.map((img: any) => ({
                  url: img.url,
                  alt: product.title,
                }))
              : [
                  {
                    url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
                    alt: product.title,
                  },
                ],
          colors:
            product.variants?.length > 0
              ? product.variants.map((v: any) => ({
                  name: v.color || "Default",
                  hex: "#000000",
                }))
              : [{ name: "Black", hex: "#000000" }],
        }
      : null;

    return (
      <>
        <GlassesProductDetail
          productData={
            glassData || {
              id: "gl-702",
              name: "Aviator Elite Gold",
              brand: "LUXORA EYEWEAR",
              collection: "Heritage Collection",
              tagline: "Timeless style meets modern UV400 protection.",
              price: 189,
              originalPrice: 245,
              rating: 4.8,
              reviewCount: 342,
              stockStatus: "Limited Stock",
              description: "Experience the pinnacle of optical engineering.",
              features: ["100% UV400 Protection", "Anti-Reflective Coating"],
              specs: {
                frameMaterial: "Titanium",
                lensType: "Polarized",
                dimensions: "58mm",
                weight: "18.5g",
              },
              images: [
                {
                  url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
                  alt: "Aviator",
                },
              ],
              colors: [{ name: "24k Gold", hex: "#171717" }],
            }
          }
          relatedProducts={relatedProducts}
        />
      </>
    );
  }

  if (isWatch) {
    const watchData = product
      ? {
          id: product.id,
          name: product.title,
          brand: product.brand || "LUXORA",
          collection: "The Prestige Series",
          price: product.price,
          originalPrice: product.discountPrice || undefined,
          rating:
            product.reviews?.length > 0
              ? product.reviews.reduce(
                  (acc: any, curr: any) => acc + curr.rating,
                  0,
                ) / product.reviews.length
              : 4.9,
          reviewCount: product.reviews?.length || 0,
          stockStatus:
            product.stockQuantity > 10
              ? "In Stock"
              : product.stockQuantity > 0
                ? "Limited Stock"
                : "Out of Stock",
          tagline: product.description.slice(0, 50) + "...",
          description: product.description,
          features: ["Water resistant", "Swiss Movement", "Sapphire Crystal"],
          specs: [
            { label: "Movement", value: "Quartz" },
            { label: "Case", value: "Stainless Steel" },
          ],
          images:
            product.images.length > 0
              ? product.images.map((img: any) => ({
                  url: img.url,
                  alt: product.title,
                }))
              : [
                  {
                    url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
                    alt: product.title,
                  },
                ],
          colors:
            product.variants?.length > 0
              ? product.variants.map((v: any) => ({
                  name: v.color || "Default",
                  class: "bg-slate-900",
                }))
              : [{ name: "Steel", class: "bg-slate-300" }],
        }
      : null;

    return (
      <WatchProductDetail
        productData={
          watchData || {
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
            description: "Crafted for those who command attention.",
            features: ["Waterproof", "Swiss Quartz"],
            specs: [{ label: "Case", value: "18k Gold" }],
            images: [
              {
                url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
                alt: "Watch",
              },
            ],
            colors: [{ name: "Gold", class: "bg-[#FFD700]" }],
          }
        }
        relatedProducts={relatedProducts}
      />
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
        <p className="text-gray-500">
          Currently only Glass and Watch view templates are supported.
        </p>
      </div>
    </div>
  );
};

export default Page;
