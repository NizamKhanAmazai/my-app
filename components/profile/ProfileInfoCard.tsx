"use client";
import { useState } from "react";
import { User as UserType } from "@/types/profile";

export default function ProfileInfoCard({ user }: { user: UserType }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">
          Personal Information
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm font-semibold text-[#FFA500] hover:text-[#e69500] transition-colors"
        >
          {isEditing ? "Cancel" : "Edit Details"}
        </button>
      </div>

      <div className="p-6">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={user.name}
              disabled={!isEditing}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFA500]/20 focus:border-[#FFA500] outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          {/* Email - Read Only in this UX flow */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">
              Email Address
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed outline-none"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue={user.phone}
              disabled={!isEditing}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFA500]/20 outline-none disabled:bg-gray-50"
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">
              Date of Birth
            </label>
            <input
              type="date"
              disabled={!isEditing}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFA500]/20 outline-none disabled:bg-gray-50"
            />
          </div>

          {isEditing && (
            <div className="md:col-span-2 mt-2">
              <button
                type="button"
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#FFA500] to-[#FFD700] text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
