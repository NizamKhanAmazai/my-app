"use client";

import {
  User,
  Package,
  Heart,
  MapPin,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "orders", label: "Order History", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Saved Addresses", icon: MapPin },
  { id: "security", label: "Security", icon: ShieldCheck },
];

export default function SidebarNavigation({ activeTab, setActiveTab }: any) {
  return (
    <nav className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 sticky top-8">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-linear-to-r from-[#FFA500]/10 to-[#FFD700]/10 text-[#FFA500]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
