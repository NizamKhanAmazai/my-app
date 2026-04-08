// 'use client';
import React from 'react';
//  { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  ArrowRight, 
  Star,  
} from 'lucide-react';
import Link from 'next/link';

// --- Types ---
interface Product {
  id: number;
  name: string;
  category: 'Watch' | 'Glasses';
  price: number;
  image: string;
  isTrending?: boolean;
}

// --- Mock Data ---
const products: Product[] = [
  { id: 1, name: "Gold Horizon Chrono", category: "Watch", price: 299, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400", isTrending: true },
  { id: 2, name: "Aviator Amber Lens", category: "Glasses", price: 145, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400", isTrending: true },
  { id: 3, name: "Midnight Stealth", category: "Watch", price: 350, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Sahara Tortoise", category: "Glasses", price: 120, image: "https://images.unsplash.com/photo-1511499767390-90342f568952?auto=format&fit=crop&q=80&w=400", isTrending: true },
];

const HomePage: React.FC = () => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  // let isMenuOpen = false; // Placeholder for menu state, can be replaced with useState when interactivity is added
  // function setIsMenuOpen(value: boolean) {  isMenuOpen = value; } // Placeholder function to toggle menu state

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#FFD700] selection:text-orange-900">
      
      

      {/* --- Hero Section --- */}
      <section className="relative pt-20 overflow-hidden bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 z-10 text-center lg:text-left mb-12 lg:mb-0">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase bg-[#FFD700]/20 text-[#CC8400] rounded-full">
              Handcrafted Excellence
            </span>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
              Details That <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA500] to-[#FFD700]">Define You.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto lg:mx-0">
              Explore our curated collection of premium timepieces and Italian-designed eyewear. Luxury isn't a price—it's a standard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/glasses" className="px-10 py-4 bg-[#FFA500] hover:bg-[#FFD700] text-white font-bold rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-orange-200 flex items-center justify-center gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              {/* <button className="px-10 py-4 border-2 border-slate-900 hover:bg-slate-900 hover:text-white font-bold rounded-full transition-all duration-300">
                View Gallery
              </button> */}
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#FFD700]/30 to-transparent rounded-full blur-3xl -z-10" />
            <img 
              src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800" 
              alt="Luxury Watch" 
              className="rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 w-full object-cover h-[400px] lg:h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* --- Trending Section --- */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Trending Now</h2>
            <div className="h-1.5 w-20 bg-[#FFA500]" />
          </div>
          <button className="group text-sm font-bold flex items-center gap-2 hover:text-[#FFA500] transition-colors">
            BROWSE ALL PRODUCTS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                />
                {product.isTrending && (
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#FFA500]">
                    Popular
                  </span>
                )}
                {/* Overlay Action */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#FFA500] hover:text-white">
                    Quick View
                  </button>
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{product.category}</p>
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-slate-900">${product.price}</span>
                  <button className="p-2.5 rounded-xl bg-gray-50 text-slate-900 hover:bg-[#FFA500] hover:text-white transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#FFA500] p-1.5 rounded">
                  <ShoppingBag className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tighter">LUXORA</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Premium quality watches and eyewear for those who value time and vision. 
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-[#FFA500] transition-colors">Instagram </a>
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-[#FFA500] transition-colors">Twitter</a>
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-[#FFA500] transition-colors">Facebook</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Collections</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Mens Watches</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Womens Watches</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blue Light Glasses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Classic Sunnies</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Customer Care</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Newsletter</h4>
              <p className="text-gray-400 mb-4 text-sm">Join the inner circle for 15% off your first order.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-[#FFA500]"
                />
                <button className="bg-[#FFA500] p-2 rounded-lg hover:bg-[#FFD700] transition-colors">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2026 LUXORA Luxury Goods Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;












































// import Link from "next/link";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// const products = [
//   {
//     id: 1,
//     name: "Wireless Headphones",
//     price: "$129.99",
//     image: "🎧",
//     category: "Electronics",
//   },
//   {
//     id: 2,
//     name: "Smart Watch",
//     price: "$199.99",
//     image: "⌚",
//     category: "Electronics",
//   },
//   {
//     id: 3,
//     name: "Running Shoes",
//     price: "$89.99",
//     image: "👟",
//     category: "Fashion",
//   },
//   {
//     id: 4,
//     name: "Winter Jacket",
//     price: "$149.99",
//     image: "🧥",
//     category: "Fashion",
//   },
//   {
//     id: 5,
//     name: "Coffee Maker",
//     price: "$79.99",
//     image: "☕",
//     category: "Home",
//   },
//   {
//     id: 6,
//     name: "Camera",
//     price: "$599.99",
//     image: "📷",
//     category: "Electronics",
//   },
// ];

// export default async function Home() {
//   const session = await getServerSession(authOptions);

//   return (
//     <div className="min-h-screen bg-zinc-50 dark:bg-black">
//       {/* Navigation */}
//       <nav className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center gap-2">
//               <span className="text-2xl">🛍️</span>
//               <h1 className="text-2xl font-bold text-black dark:text-white">
//                 StoreName
//               </h1>
//             </div>
//             <div className="flex items-center gap-4">
//               {session ? (
//                 <>
//                   <span className="text-zinc-700 dark:text-zinc-300">Welcome, {session.user?.name}</span>
//                   <Link
//                     href="/api/auth/signout?callbackUrl=/"
//                     className="px-4 py-2 rounded-md text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
//                   >
//                     Sign Out
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     href="/signin"
//                     className="px-4 py-2 rounded-md text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
//                   >
//                     Sign In
//                   </Link>
//                   <Link
//                     href="/signup"
//                     className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
//                   >
//                     Sign Up
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-white py-20 px-4">
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="text-4xl sm:text-5xl font-bold mb-4">
//             Welcome to Your Online Store
//           </h2>
//           <p className="text-lg sm:text-xl text-blue-100 mb-8">
//             Discover amazing products at unbeatable prices
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
//               Shop Now
//             </button>
//             {!session && (
//               <Link
//                 href="/signin"
//                 className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors"
//               >
//                 Sign In to Shop
//               </Link>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Categories Section */}
//       <section className="py-12 px-4 bg-white dark:bg-zinc-900">
//         <div className="max-w-7xl mx-auto">
//           <h3 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-8">
//             Shop by Category
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             {["Electronics", "Fashion", "Home"].map((category) => (
//               <div
//                 key={category}
//                 className="p-8 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded-lg text-center cursor-pointer hover:shadow-lg transition-shadow"
//               >
//                 <h4 className="text-xl font-semibold text-black dark:text-white">
//                   {category}
//                 </h4>
//                 <p className="text-zinc-600 dark:text-zinc-400 mt-2">
//                   Explore {category.toLowerCase()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Products Section */}
//       <section className="py-16 px-4 bg-zinc-50 dark:bg-black">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex justify-between items-center mb-8">
//             <h3 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
//               Featured Products
//             </h3>
//             {!session && (
//               <Link
//                 href="/signin"
//                 className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
//               >
//                 View All →
//               </Link>
//             )}
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.map((product) => (
//               <div
//                 key={product.id}
//                 className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-zinc-200 dark:border-zinc-800 overflow-hidden"
//               >
//                 <div className="w-full h-48 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-6xl">
//                   {product.image}
//                 </div>
//                 <div className="p-4">
//                   <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
//                     {product.category}
//                   </span>
//                   <h4 className="text-lg font-semibold text-black dark:text-white mt-2">
//                     {product.name}
//                   </h4>
//                   <div className="flex justify-between items-center mt-4">
//                     <span className="text-2xl font-bold text-black dark:text-white">
//                       {product.price}
//                     </span>
//                     {session ? (
//                       <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
//                         Add to Cart
//                       </button>
//                     ) : (
//                       <Link
//                         href="/signin"
//                         className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
//                       >
//                         Sign In to Buy
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       {!session && (
//         <section className="py-16 px-4 bg-white dark:bg-zinc-900">
//           <div className="max-w-4xl mx-auto text-center">
//             <h3 className="text-3xl font-bold text-black dark:text-white mb-4">
//               Ready to Shop?
//             </h3>
//             <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
//               Create an account to access exclusive deals and track your orders
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link
//                 href="/signup"
//                 className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Create Account
//               </Link>
//               <Link
//                 href="/signin"
//                 className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors"
//               >
//                 Sign In
//               </Link>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Footer */}
//       <footer className="bg-black dark:bg-zinc-950 text-white py-12 px-4">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8">
//           <div>
//             <h4 className="font-bold mb-4">About Us</h4>
//             <ul className="space-y-2 text-sm text-zinc-400">
//               <li><Link href="#" className="hover:text-white">About</Link></li>
//               <li><Link href="#" className="hover:text-white">Blog</Link></li>
//               <li><Link href="#" className="hover:text-white">Careers</Link></li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-bold mb-4">Support</h4>
//             <ul className="space-y-2 text-sm text-zinc-400">
//               <li><Link href="#" className="hover:text-white">Help Center</Link></li>
//               <li><Link href="#" className="hover:text-white">Contact</Link></li>
//               <li><Link href="#" className="hover:text-white">FAQ</Link></li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-bold mb-4">Legal</h4>
//             <ul className="space-y-2 text-sm text-zinc-400">
//               <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
//               <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
//               <li><Link href="#" className="hover:text-white">Cookies</Link></li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-bold mb-4">Follow Us</h4>
//             <ul className="space-y-2 text-sm text-zinc-400">
//               <li><Link href="#" className="hover:text-white">Twitter</Link></li>
//               <li><Link href="#" className="hover:text-white">Facebook</Link></li>
//               <li><Link href="#" className="hover:text-white">Instagram</Link></li>
//             </ul>
//           </div>
//         </div>
//         <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-sm text-zinc-400">
//           <p>&copy; 2024 StoreName. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }
