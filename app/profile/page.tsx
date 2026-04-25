"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SidebarNavigation from "@/components/profile/SidebarNavigation";
import ProfileInfoCard from "@/components/profile/ProfileInfoCard";
import OrderHistory from "@/components/profile/OrderHistory";
import WishlistGrid from "@/components/profile/WishlistGrid";
import AddressManager from "@/components/profile/AddressManager";
import SecuritySettings from "@/components/profile/SecuritySettings";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { useAppSelector } from "@/store/hooks";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();
  const { status } = useSession();

  const reduxUser = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-up");
    }
  }, [status, router]);

  const user = reduxUser
    ? {
        id: reduxUser.id,
        name: reduxUser.name,
        email: reduxUser.email,
        phone: reduxUser.phoneNumber || "03001234567",
        image:
          reduxUser.image ||
          "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        membership: reduxUser.membership || "Premium",
      }
    : null;

  if (status === "loading" || status === "unauthenticated" || !user)
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <ProfileSkeleton />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fafafa] py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <ProfileHeader />

        <div className="mt-8 flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64">
            <SidebarNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </aside>

          <main className="flex-1 transition-all duration-300">
            {activeTab === "profile" && <ProfileInfoCard user={user} />}
            {activeTab === "orders" && <OrderHistory />}
            {activeTab === "wishlist" && <WishlistGrid />}
            {activeTab === "addresses" && <AddressManager />}
            {activeTab === "security" && <SecuritySettings />}
          </main>
        </div>
      </div>
    </div>
  );
}
