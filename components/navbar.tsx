'use client';
import React from 'react'
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

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <>
    {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href={'/'} className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-gradient-to-tr from-[#FFA500] to-[#FFD700] p-2 rounded-lg transform group-hover:rotate-12 transition-transform">
                <ShoppingBag className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-800">LUXORA</span>
            </Link>

            {/* Desktop Categories */}
            <div className="hidden md:flex items-center space-x-8 font-medium text-sm uppercase tracking-widest">
              <Link href="/watches" className="hover:text-[#FFA500] transition-colors">Watches</Link>
              <Link href="/glasses" className="hover:text-[#FFA500] transition-colors">Glasses</Link>
              <Link href="/new-in" className="text-gray-400 cursor-not-allowed">New In</Link>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-[#FFA500] transition-all">
              <Search className="text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search luxury..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-5">
              <a href="/login" className="hidden sm:block text-sm font-bold hover:text-[#FFA500] transition-colors">Sign In</a>
              <div className="relative cursor-pointer hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-[#FFA500] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
              </div>
              <button className="md:hidden"
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               >
                {isMenuOpen ? <X /> : 
                <Menu /> }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-4 animate-in slide-in-from-top duration-300">
            <a href="#" className="block text-lg font-bold">Watches</a>
            <a href="#" className="block text-lg font-bold">Glasses</a>
            <hr />
            <a href="/login" className="block text-[#FFA500] font-bold">Login / Sign Up</a>
          </div>
         )} 
      </nav>
    </>
  )
}

export default Navbar
