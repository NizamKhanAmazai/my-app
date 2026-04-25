"use client";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SecuritySettings() {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      return data;
    } catch (error: any) {
      console.error("Change password error:", error.message);
      throw error;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
        <ShieldCheck className="text-[#FFA500]" size={20} />
        <h3 className="text-lg font-bold text-gray-900">Security & Password</h3>
      </div>
      <div className="p-6">
        <form className="max-w-md space-y-5 ">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFA500]/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFA500]/20 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-xs font-semibold text-gray-500 hover:text-[#FFA500] flex items-center gap-1.5"
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPass ? "Hide Passwords" : "Show Passwords"}
            </button>
          </div>

          <button
            type="submit" 
            onClick={() => changePassword(oldPassword, newPassword)}
            className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-200"
          >
            Update Password
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl flex gap-3">
          <div className="shrink-0 w-1.5 h-auto bg-blue-400 rounded-full" />
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Security Tip:</strong> Use at least 8 characters, including
            numbers and symbols, to ensure your account remains premium-grade
            secure.
          </p>
        </div>
      </div>
    </div>
  );
}
