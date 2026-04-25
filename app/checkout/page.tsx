// app/checkout/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { InputField } from "@/components/Checkout/InputField";
import { OrderSummary } from "@/components/Checkout/OrderSummary";
import { OrderItem, FormData } from "@/types/checkout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/features/cartSlice";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const cartItems = useAppSelector((state) => state.cart.items);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CREDIT_CARD" | "COD">(
    "COD",
  );
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    landmark: "",
  });

  // Protect page: Redirect to signup if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-up");
      setTimeout(() => {
        alert("Please sign up or sign in to proceed to checkout.");
      }, 500);
    }
  }, [status, router]);

  // Convert Redux Cart Items to Order Items
  const orderItems: OrderItem[] = cartItems.map((item) => ({
    id: item.productId,
    name: item.title,
    variant: item.selectedVariant,
    quantity: item.quantity,
    price: item.discountPrice ?? item.price,
    image: item.image,
  }));

  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingFee = subtotal > 0 ? 15.0 : 0;
  const total = subtotal + shippingFee;

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: session.user.name || "",
        email: session.user.email || "",
        phone: (session.user as any).phoneNumber || "",
      }));

      // Fetch saved address if possible
      const fetchAddress = async () => {
        try {
          const res = await fetch("/api/addresses");
          if (res.ok) {
            const addresses = await res.json();
            if (addresses.length > 0) {
              const defaultAddr =
                addresses.find((a: any) => a.isDefault) || addresses[0];
              setFormData((prev) => ({
                ...prev,
                address: defaultAddr.fullAddress || defaultAddr.address || "",
                city: defaultAddr.city || "",
                postalCode: defaultAddr.postalCode || "",
                landmark: defaultAddr.landmark || "",
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      };
      fetchAddress();
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (orderItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems, // Send full cart items for API logic
          customer: formData,
          payment: { method: paymentMethod },
          subtotal,
          shippingFee,
          total,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to place order");
      }

      alert("Order placed successfully!");
      dispatch(clearCart());

      router.push("/profile");
    } catch (error: any) {
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  // Hide page content if not authenticated (useEffect handles redirect)
  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-gray-50/50 py-25 ">
      {/* Header */}
      {/*<header className="bg-white border-b border-gray-100 py-6 mb-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <h1 className="text-2xl font-black tracking-tighter text-orange-600 italic">
            LUXE.STORE
          </h1> 
           <nav className="flex items-center gap-3 text-sm font-medium">
            <span className="text-gray-400">Cart</span>
            <span className="text-gray-300">/</span>
            <span className="text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-full">
              Checkout
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-400">Payment</span>
          </nav> 
        </div>
      </header>*/}

      <main className="max-w-6xl mx-auto px-4">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* Left Column: Shipping & Info */}
          <div className="lg:col-span-7 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  required
                  onChange={handleInputChange}
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  required
                  onChange={handleInputChange}
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  className="md:col-span-2"
                  onChange={handleInputChange}
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputField
                    label="Street Address"
                    name="address"
                    value={formData.address}
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <InputField
                  label="City"
                  name="city"
                  value={formData.city}
                  required
                  onChange={handleInputChange}
                />
                <InputField
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  required
                  onChange={handleInputChange}
                />
                <div className="md:col-span-2">
                  <InputField
                    label="landmark"
                    name="landmark"
                    value={formData.landmark}
                    required
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Payment Method
              </h2>
              <div className="space-y-4">
                {/* Method Toggles */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    disabled={true} // Disable until card details are implemented
                    onClick={() => setPaymentMethod("CREDIT_CARD")}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === "CREDIT_CARD" ? "border-orange-500 bg-orange-50/50" : "border-gray-100 hover:border-gray-200"}`}
                  >
                    <span
                      className={`block font-bold ${paymentMethod === "CREDIT_CARD" ? "text-orange-600" : "text-gray-600"}`}
                    >
                      Credit Card
                    </span>
                    <span className="text-xs text-gray-400">
                      Visa, Mastercard, Amex
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("COD")}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === "COD" ? "border-orange-500 bg-orange-50/50" : "border-gray-100 hover:border-gray-200"}`}
                  >
                    <span
                      className={`block font-bold ${paymentMethod === "COD" ? "text-orange-600" : "text-gray-600"}`}
                    >
                      Cash on Delivery
                    </span>
                    <span className="text-xs text-gray-400">
                      Pay when you receive
                    </span>
                  </button>
                </div>

                {/* Card Inputs */}
                {paymentMethod === "CREDIT_CARD" && (
                  <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
                    <InputField label="Cardholder Name" name="cardHolder" />
                    <InputField label="Card Number" name="cardNumber" />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Expiry (MM/YY)" name="expiry" />
                      <InputField label="CVV" name="cvv" />
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Summary & CTA */}
          <div className="lg:col-span-5">
            <OrderSummary items={orderItems} />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-3 rounded-3xl font-bold text-lg text-white shadow-xl shadow-orange-200 transition-all
                bg-linear-to-r from-orange-500 via-amber-500 to-orange-500 bg-size-[200%_auto] hover:bg-right active:scale-[0.98]
                disabled:from-gray-300 disabled:via-gray-400 disabled:to-gray-300 disabled:shadow-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Place Order Now"
              )}
            </button>
            <p className="text-center text-gray-400 text-xs mt-6 px-10">
              By clicking "Place Order Now", you agree to our Terms of Service
              and Privacy Policy.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
