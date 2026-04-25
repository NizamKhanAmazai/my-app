"use client";

import React, { useMemo } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft, 
  Truck,
  ShieldCheck,
  ArrowRight,
  Info,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeFromCart,
  updateQuantity,
  CartItem as ReduxCartItem,
} from "@/store/features/cartSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Types Based on Your Prisma Schema ---

interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

interface ProductVariant {
  id: string;
  name: string; // e.g., "Color"
  value: string; // e.g., "Midnight Black"
}

interface CartItemType {
  id: string;
  quantity: number;
  selectedVariant?: string; // Derived from ProductVariant for the UI
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    discountPrice?: number | null;
    brand?: string | null;
    sku: string;
    stockQuantity: number;
    images: ProductImage[];
  };
}

// --- Mock Data ---

const MOCK_CART: CartItemType[] = [
  {
    id: "cart-1",
    quantity: 1,
    selectedVariant: "Size: 42, Color: Sunset Orange",
    product: {
      id: "p-1",
      title: "Performance Tech Jacket",
      description:
        "Water-resistant, breathable outer shell for high-intensity training.",
      price: 249.0,
      discountPrice: 199.0,
      brand: "Luminary Peak",
      sku: "JKT-001-OR",
      stockQuantity: 15,
      images: [
        {
          id: "img-1",
          url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&h=400&fit=crop",
        },
      ],
    },
  },
  {
    id: "cart-2",
    quantity: 2,
    selectedVariant: "Edition: Premium Gold",
    product: {
      id: "p-2",
      title: "Chronos Heritage Watch",
      description:
        "Automatic movement with a 72-hour power reserve and sapphire crystal.",
      price: 850.0,
      discountPrice: null,
      brand: "Vanguard",
      sku: "WTC-772-GL",
      stockQuantity: 5,
      images: [
        {
          id: "img-2",
          url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&h=400&fit=crop",
        },
      ],
    },
  },
];

// --- Components ---

const QuantitySelector = ({
  qty,
  stock,
  onUpdate,
}: {
  qty: number;
  stock: number;
  onUpdate: (n: number) => void;
}) => (
  <div className="flex items-center bg-white border border-stone-200 rounded-2xl p-1 shadow-sm">
    <button
      onClick={() => onUpdate(-1)}
      disabled={qty <= 1}
      className="p-2 text-stone-400 hover:text-orange-600 disabled:opacity-30 transition-colors"
    >
      <Minus size={16} />
    </button>
    <span className="w-10 text-center font-bold text-stone-800 text-sm">
      {qty}
    </span>
    <button
      onClick={() => onUpdate(1)}
      disabled={qty >= stock}
      className="p-2 text-stone-400 hover:text-orange-600 disabled:opacity-30 transition-colors"
    >
      <Plus size={16} />
    </button>
  </div>
);

const CartItem = ({ item }: { item: ReduxCartItem }) => {
  const dispatch = useAppDispatch();
  const {
    productId,
    quantity,
    selectedVariant,
    price,
    discountPrice,
    title,
    brand,
    description,
    image,
    sku,
    stockQuantity,
  } = item;
  const currentPrice = discountPrice ?? price;
  const hasDiscount = !!discountPrice;

  return (
    <div className=" group relative bg-white rounded-3xl p-4 sm:p-6 border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-500 mb-4">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Image Container */}
        <div className="relative h-40 w-full sm:w-40 rounded-2xl overflow-hidden bg-stone-50 shrink-0">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-lg">
              Sale
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">
                  {brand}
                </p>
                <h3 className="text-xl font-bold text-stone-800 leading-tight mb-1">
                  {title}
                </h3>
                <p className="text-sm text-stone-400 line-clamp-1">
                  {description}
                </p>
              </div>
              <button
                onClick={() =>
                  dispatch(removeFromCart({ productId, selectedVariant }))
                }
                className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-stone-50 text-stone-500 text-xs rounded-full border border-stone-100">
                {selectedVariant}
              </span>
              <span className="px-3 py-1 bg-stone-50 text-stone-500 text-xs rounded-full border border-stone-100 uppercase">
                SKU: {sku}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-stone-400 font-medium mb-1">
                Price per item
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-stone-900">
                  Rs {currentPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-stone-300 line-through font-medium">
                    Rs {price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <QuantitySelector
              qty={quantity}
              stock={stockQuantity}
              onUpdate={(delta) =>
                dispatch(
                  updateQuantity({
                    productId,
                    selectedVariant,
                    quantity: delta,
                  }),
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const router = useRouter();

  const subtotal = useMemo(
    () =>
      items.reduce(
        (acc, item) => acc + (item.discountPrice ?? item.price) * item.quantity,
        0,
      ),
    [items],
  );

  if (items.length === 0) {
    return (
      <div className=" min-h-screen bg-[#fffcf9] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-orange-200 blur-3xl opacity-30 rounded-full" />
          <div className="relative w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center border border-orange-50">
            <ShoppingBag size={48} className="text-orange-500" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-stone-900 mb-2">
          Your Bag is Empty
        </h2>
        <p className="text-stone-500 max-w-sm mb-8">
          Items remain in your bag for 30 days. Don't let your favorites slip
          away!
        </p>
        <Link
          href="/"
          className="px-10 py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-stone-200"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf9] text-stone-900 pb-24 pt-12">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl text-center w-full font-black tracking-tight mb-2">
              Your Cart
            </h1>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
              <p className="text-stone-500 font-medium">
                You have {items.length} premium pieces in your selection
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-stone-500 hover:text-orange-600 font-bold transition-colors text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            Back to Catalog
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* List Section */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={`${item.productId}-${item.selectedVariant}`}
                  item={item}
                />
              ))}
            </div>

            {/* Loyalty/Shipping Banner */}
            <div className="mt-8 p-6 rounded-3xl bg-linear-to-r from-orange-700 to-yellow-700 text-white flex items-center justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <p className="text-slate-950 font-bold text-xs uppercase tracking-widest mb-1">
                  Member Privilege
                </p>
                <h4 className="text-lg font-bold">Shipping Covered by Us</h4>
                <p className="text-stone-300 text-sm mt-1">
                  You are eligible for free express shipping. Estimated
                  delivery: 2-3 business days.
                </p>
              </div>
              <Truck
                size={60}
                className="text-stone-700/50 absolute -right-4 -bottom-2 group-hover:translate-x-2 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-2xl shadow-stone-200/40">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  Summary
                  <Info size={16} className="text-stone-300" />
                </h3>

                {/* Promo */}
                <div className="relative mb-8">
                  <input
                    type="text"
                    placeholder="PROMO CODE"
                    className="w-full pl-5 pr-20 py-4 bg-stone-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all outline-none placeholder:text-stone-300"
                  />
                  <button className="absolute right-2 top-2 bottom-2 px-4 bg-stone-900 text-white text-[10px] font-black rounded-xl hover:bg-orange-500 transition-colors">
                    APPLY
                  </button>
                </div>

                {/* Totals */}
                <div className="space-y-4 border-b border-stone-50 pb-8">
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="font-medium text-sm">Subtotal</span>
                    <span className="font-bold text-stone-900">
                      Rs {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="font-medium text-sm">Delivery</span>
                    <span className="text-orange-500 font-bold text-xs uppercase tracking-widest">
                      Free
                    </span>
                  </div>
                  {/* <div className="flex justify-between items-center text-stone-500">
                    <span className="font-medium text-sm">Tax Estimate</span>
                    <span className="font-bold text-stone-900">
                      Rs {(subtotal * 0.05).toFixed(2)}
                    </span>
                  </div> */}
                </div>

                <div className="pt-8 mb-8 flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase mb-1">
                      Total Amount
                    </p>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-br from-orange-600 to-yellow-500">
                      Rs{" "}
                      {(subtotal).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    router.push("/checkout");
                  }}
                  className="w-full group relative overflow-hidden bg-stone-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-stone-200 hover:shadow-orange-200 transition-all active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Checkout Now
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </button>

                <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-40">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Secure Checkout Guaranteed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
