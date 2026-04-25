"use client";
import React from "react";
import { ShoppingBag, Search, Menu, X, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signOut } from "next-auth/react";
import { clearUser } from "@/store/features/userSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const userdata = useAppSelector((state) => state.user.user);
  const cartItems = useAppSelector((state) => state.cart.items);
  // console.log(userdata);
  const router = useRouter();

  const handleSignOut = async () => {
    dispatch(clearUser());
    await signOut({ callbackUrl: "/sign-up" });
  };
  return (
    <>
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full bg-slate-950/90 backdrop-blur-xl z-50 border-b border-white/5">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href={"/"}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="bg-linear-to-tr from-[#FFA500] to-[#FFD700] p-2 rounded-xl shadow-lg shadow-orange-500/20 transform group-hover:rotate-12 transition-all duration-300">
                <ShoppingBag className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                LUXORA
              </span>
            </Link>

            {/* Desktop Categories */}
            <div className="hidden md:flex items-center space-x-10 font-bold text-[11px] uppercase tracking-[0.2em] text-white/70">
              <Link
                href="/watches"
                className="hover:text-white hover:tracking-[0.3em] transition-all duration-300"
              >
                Watches
              </Link>
              <Link
                href="/glasses"
                className="hover:text-white hover:tracking-[0.3em] transition-all duration-300"
              >
                Glasses
              </Link>
              <Link href="/new-in" className="text-white/20 cursor-not-allowed">
                New In
              </Link>
            </div>

            {/* Search Bar (Desktop) */}
            <Link
              href="/search"
              className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-5 py-2.5 w-72 hover:bg-white/10 hover:border-white/20 hover:ring-1 hover:ring-[#FFA500]/30 transition-all duration-500 group"
            >
              <Search className="text-white/40 w-4 h-4 group-hover:text-[#FFA500] transition-colors duration-300" />
              <span className="ml-3 text-xs text-white/30 font-light group-hover:text-white/50 transition-colors duration-300">
                Search luxury curation...
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center space-x-6">
              {userdata ? (
                <Link
                  href="/profile"
                  className="hidden sm:block group relative"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#FFA500] transition-colors">
                    <Image
                      src={
                        userdata.image ||
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                      }
                      width={36}
                      height={36}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full"></span>
                </Link>
              ) : (
                <a
                  href="/sign-in"
                  className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-white hover:text-[#FFA500] transition-colors"
                >
                  Sign In
                </a>
              )}

              <div
                className="relative cursor-pointer group"
                onClick={() => {
                  router.push("/cart");
                }}
              >
                <div className="p-2 rounded-full group-hover:bg-white/5 transition-colors">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <span className="absolute top-0 right-0 bg-[#FFA500] text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-lg">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>

              <button
                className="md:hidden text-white p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-20 bg-slate-950 border-t border-white/5 p-8 space-y-8 animate-in slide-in-from-top-4 duration-500 ease-out h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden">
            <div className="space-y-6">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                Collections
              </p>
              <a
                href="/watches"
                className="block text-md font-black text-white hover:text-[#FFA500] transition-colors"
              >
                Watches
              </a>
              <a
                href="/glasses"
                className="block text-md font-black text-white hover:text-[#FFA500] transition-colors"
              >
                Glasses
              </a>
              <Link
                href="/search"
                className="flex items-center bg-white/5 border border-white/10 rounded-full px-5 py-2.5 w-[90%] hover:bg-white/10 hover:border-white/20 hover:ring-1 hover:ring-[#FFA500]/30 transition-all duration-500 group"
              >
                <Search className="text-white/40 w-4 h-4 group-hover:text-[#FFA500] transition-colors duration-300" />
                <span className="ml-3 text-xs text-white/30 font-light group-hover:text-white/50 transition-colors duration-300">
                  Search luxury curation...
                </span>
              </Link>
            </div>

            <hr className="border-white/5" />

            <div className="space-y-6">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                Account
              </p>
              {userdata ? (
                <div className="space-y-6">
                  <a
                    href="/profile"
                    className="flex items-center min-w-0 text-xl font-bold text-white hover:text-[#FFA500]"
                  >
                    <User className="w-5 h-5 mr-3 text-[#FFA500]" />
                    My Profile
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left text-xl font-bold text-red-400"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <a
                  href="/sign-in"
                  className="block text-md font-black text-[#FFA500] uppercase tracking-widest"
                >
                  Login / Sign Up
                </a>
              )}
            </div>

            <div className="pt-12 px-2">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-xs text-white/50 leading-relaxed">
                  Experience ultimate luxury. Join our inner circle for
                  exclusive updates.
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
