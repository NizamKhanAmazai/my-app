import React from "react";
import {
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Footer from "@/components/Footer";

// --- Types ---
interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category?: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  rating: number;
}

interface PromoBanner {
  heading: string;
  subtext: string;
  ctaLabel: string;
}

// --- Mock Data ---
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Aura Noise-Cancelling Headphones",
    price: 349,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "2",
    name: "Lunar Smart Watch Series 5",
    price: 199,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "3",
    name: "Velocity Knit Runners",
    price: 125,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "4",
    name: "Minimalist Leather Tote",
    price: 85,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1584917033904-4911785ad69c?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "5",
    name: "PureSound Bluetooth Speaker",
    price: 159,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "6",
    name: "Zenith Mechanical Keyboard",
    price: 175,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "7",
    name: "Vantage 4K Action Camera",
    price: 299,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1526170315870-ef51865e39a3?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "8",
    name: "Titanium Travel Bottle",
    price: 45,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1602143399827-bd95968330b7?auto=format&fit=crop&q=80&w=600",
  },
];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    role: "Design Enthusiast",
    feedback:
      "The quality of the products exceeded my expectations. The shipping was incredibly fast and the packaging was premium.",
    rating: 5,
  },
  {
    id: "2",
    name: "Marcus Thorne",
    role: "Tech Reviewer",
    feedback:
      "Finally a store that balances aesthetics with functionality. Every piece I bought feels like it was designed for me.",
    rating: 5,
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    role: "Daily Commuter",
    feedback:
      "Customer support was so helpful when I needed to exchange sizes. Smooth process from start to finish!",
    rating: 4,
  },
];

const FALLBACK_PROMO_BANNER: PromoBanner = {
  heading: "UP TO 50% OFF THIS SEASON",
  subtext:
    "Don't miss our biggest sale of the year. Grab your favorites before they're gone forever.",
  ctaLabel: "Claim Discount",
};

// --- Internal Reusable Components ---

const Button = ({
  children,
  variant = "primary",
  className = "",
  href,
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const base =
    "px-8 py-3 rounded-full font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary:
      "bg-linear-to-r from-orange-500 to-yellow-400 text-white shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5",
    secondary: "bg-slate-900 text-orange-500 hover:bg-slate-800 ",
    outline: "border-2 border-orange-500 text-orange-600 hover:bg-orange-50",
  };

  const content = (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

const ProductCard = ({ product }: { product: Product }) => (
  <div className="group bg-white rounded-3xl p-4 transition-all duration-500 hover:shadow-2xl border border-transparent hover:border-orange-100">
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50 mb-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold shadow-sm">
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{" "}
        {product.rating}
      </div>
    </div>
    <h3 className="text-slate-800 font-bold mb-1 truncate">{product.name}</h3>
    <p className="text-orange-600 font-black text-lg mb-4">
      Rs {product.price}
    </p>
    <Link
      href={`/product/${product.id}`}
      className="w-full py-3 bg-slate-50 text-slate-900 rounded-xl font-bold text-sm group-hover:bg-orange-500 group-hover:text-white transition-colors flex items-center justify-center gap-2"
    >
      <ShoppingBag className="w-4 h-4" /> View Details
    </Link>
  </div>
);

async function getHomepageProducts(): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: {
      reviews: true,
      images: true,
      category: true,
    },
  });

  if (dbProducts.length === 0) {
    return FALLBACK_PRODUCTS;
  }

  return dbProducts.map((product) => {
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    const avgRating =
      product.reviews.length > 0
        ? Number((totalRating / product.reviews.length).toFixed(1))
        : 4.8;

    return {
      id: product.id,
      name: product.title,
      price: product.discountPrice ?? product.price,
      rating: avgRating,
      image:
        product.images[0]?.url ??
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
      category: product.category.name,
    };
  });
}

async function getHomepagePromoBanner(): Promise<PromoBanner> {
  const banner = await prisma.homepagePromoBanner.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });

  if (!banner) {
    return FALLBACK_PROMO_BANNER;
  }

  return {
    heading: banner.heading,
    subtext: banner.subtext,
    ctaLabel: banner.ctaLabel || "Shop Now",
  };
}

async function getHomepageTestimonials(): Promise<Testimonial[]> {
  const testimonials = await prisma.homepageTestimonial.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    take: 6,
  });

  if (testimonials.length === 0) {
    return FALLBACK_TESTIMONIALS;
  }

  return testimonials.map((testimonial) => ({
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role,
    feedback: testimonial.feedback,
    rating: testimonial.rating,
  }));
}

// --- Main Page ---

export default async function EcommerceHomepage() {
  const [products, promoBanner, testimonials] = await Promise.all([
    getHomepageProducts(),
    getHomepagePromoBanner(),
    getHomepageTestimonials(),
  ]);
  const currentYear = new Date().getFullYear();
  const dynamicCategories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean)),
  ).slice(0, 4) as string[];
  const categoryCards =
    dynamicCategories.length > 0
      ? dynamicCategories.map((categoryName) => ({
          name: categoryName,
          href: categoryName.toLowerCase().includes("watch")
            ? "/watches"
            : categoryName.toLowerCase().includes("glass")
              ? "/glasses"
              : "/search",
          image:
            products.find((product) => product.category === categoryName)
              ?.image ??
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
        }))
      : [
          { name: "Men", href: "/search", image: FALLBACK_PRODUCTS[0].image },
          { name: "Women", href: "/search", image: FALLBACK_PRODUCTS[1].image },
          {
            name: "Electronics",
            href: "/search",
            image: FALLBACK_PRODUCTS[2].image,
          },
          {
            name: "Lifestyle",
            href: "/search",
            image: FALLBACK_PRODUCTS[3].image,
          },
        ];

  return (
    <div className="min-h-screen h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden px-6 pt-25 pb-10">
        {/* Background Image with Premium Overlays */}
        <div className="absolute inset-0 z-0 top-20">
          <img
            src="/heroImage/hero%20image.png"
            alt="Hero Background"
            className="w-full h-full object-cover object-[80%_80%] xl:object-top-left 2xl:object-top "
            // className="w-full h-full object-cover object-top"
          />
          {/* Gradients for depth and text legibility */}
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-slate-950/20" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#FFA500] font-bold text-[10px] tracking-[0.3em] mb-8 uppercase backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Defining the Future of luxury
            </div>

            <h1 className="text-3xl md:text-5xl font-black leading-[0.85] mb-8 tracking-tighter text-white">
              Elevate <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FFA500] to-[#FFD700] drop-shadow-sm">
                Every Moment.
              </span>
            </h1>

            <p className="text-xl text-white/60 mb-12 max-w-xl leading-relaxed font-medium">
              Step into a world where craftsmanship meets contemporary
              innovation. Our curated collection brings you the pinnacle of
              premium design and timeless elegance.
            </p>

            <div className="flex flex-wrap gap-5">
              <Button
                variant="primary"
                href="/search"
                className="h-16 px-12 text-sm uppercase tracking-widest shadow-2xl shadow-orange-500/20"
              >
                Explore Collection
              </Button>
              {/* <Button className="h-16 px-12 text-sm uppercase tracking-widest bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md">
                Our Story
              </Button> */}
            </div>

            {/* <div className="mt-20 flex items-center gap-12 border-t border-white/5 pt-12">
              <div>
                <p className="text-3xl font-black text-white">25k+</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                  Global Clients
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">4.9/5</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                  Average Rating
                </p>
              </div>
              <div className="hidden sm:block">
                <p className="text-3xl font-black text-white">100%</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                  Purity Guarantee
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* 2. Trending Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black mb-2 tracking-tight">
              Trending Now
            </h2>
            <p className="text-slate-500">The most wanted items this week</p>
          </div>
          <Button variant="outline" href="/search" className="hidden md:flex">
            View Collection
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. New Arrivals (Horizontal Style) */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-4xl font-black mb-2 tracking-tight">
              New Arrivals
            </h2>
            <p className="text-slate-400">Freshly landed in our warehouse</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="relative group overflow-hidden rounded-3xl bg-slate-800"
              >
                <img
                  src={product.image}
                  className="w-full h-100 object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-linear-to-t from-black/80 to-transparent">
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  <p className="text-orange-400 font-bold mb-4">
                    ${product.price}
                  </p>
                  <Link
                    href={`/product/${product.id}`}
                    className="flex items-center gap-2 font-bold hover:gap-4 transition-all"
                  >
                    Quick View <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Categories Section */}
      <section className="py-20 container mx-auto px-4 text-center">
        <h2 className="text-4xl font-black mb-12 tracking-tight">
          Shop by Category
        </h2>
        <div className="flex flex-row items-center justify-center gap-6">
          {categoryCards.map((categoryItem) => (
            <Link
              key={categoryItem.name}
              href={categoryItem.href}
              className="group cursor-pointer"
            >
              <div className="relative h-64 rounded-4xl overflow-hidden mb-4">
                <img
                  src={categoryItem.image}
                  alt={categoryItem.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              </div>
              <h3 className="text-xl font-bold">{categoryItem.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Featured Collection */}
      <section className="py-20 bg-orange-50 px-6">
        <div className="container mx-auto rounded-[3rem] bg-white overflow-hidden shadow-xl grid md:grid-cols-2">
          <div className="p-2  md:p-12 lg:p-24 flex flex-col justify-center">
            <h2 className="text-4xl font-black mb-6 leading-tight">
              The Editor's Choice: <br />
              <span className="text-orange-500 text-5xl">Minimalist 2026</span>
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed text-lg">
              A hand-picked selection of items that define the "Less is More"
              philosophy. Every product in this collection is guaranteed to last
              a lifetime.
            </p>
            <Button variant="secondary" href="/search" className="w-fit">
              View Selection
            </Button>
          </div>
          <div className="bg-slate-200">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. Promotional Banner */}
      <section className="py-12 container mx-auto px-6">
        <div className="bg-linear-to-r flex-col items-center justify-center md:items-start from-orange-500 via-orange-600 to-yellow-500 rounded-2xl md:rounded-[3rem] p-3 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            {promoBanner.heading}
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            {promoBanner.subtext}
          </p>
          <Button
            variant="secondary"
            href="/search"
            className="bg-white text-black hover:text-white hover:bg-slate-100"
          >
            {promoBanner.ctaLabel}
          </Button>
        </div>
      </section>

      {/* 7. Value Proposition */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          {[
            {
              icon: <Truck />,
              title: "Free Shipping",
              desc: "On all orders above $150",
            },
            {
              icon: <ShieldCheck />,
              title: "Secure Payment",
              desc: "Military grade encryption",
            },
            {
              icon: <RotateCcw />,
              title: "Easy Returns",
              desc: "30-day hassle-free policy",
            },
            {
              icon: <Headphones />,
              title: "24/7 Support",
              desc: "Real humans, real help",
            },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold mb-2">{item.title}</h4>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Featured Products Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black mb-12 text-center">
            More To Explore
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black mb-16 text-center tracking-tight">
            Loved by Thousands
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-orange-400 text-orange-400"
                    />
                  ))}
                </div>
                <p className="text-slate-600 italic mb-8">"{t.feedback}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                    {t.name[0]}
                  </div>
                  <div>
                    <h5 className="font-bold">{t.name}</h5>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Newsletter */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-8 lg:p-20 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Get 10% Off Your First Order
              </h2>
              <p className="text-slate-400 mb-10 max-w-lg mx-auto">
                Join the club and be the first to know about new drops and
                exclusive member-only sales.
              </p>
              <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Button variant="primary">Subscribe</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <Footer categoryCards={categoryCards} />
    </div>
  );
}
