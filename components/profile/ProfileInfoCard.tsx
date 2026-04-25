"use client";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/store/features/userSlice";
import { User as UserType } from "@/types/profile";

export default function ProfileInfoCard({ user }: { user: UserType }) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    name: user.name,
    phone: user.phone,
  });

  useEffect(() => {
    setFormValues({
      name: user.name,
      phone: user.phone,
    });
  }, [user.name, user.phone]);

  const handleCancel = () => {
    setFormValues({
      name: user.name,
      phone: user.phone,
    });
    setError(null);
    setSuccess(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formValues.name,
          phoneNumber: formValues.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update profile");
      }

      dispatch(
        updateUser({
          name: data.user.name,
          phoneNumber: data.user.phoneNumber ?? undefined,
        }),
      );
      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

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
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (!isEditing) {
              setIsEditing(true);
              return;
            }
            void handleSave();
          }}
        >
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">
              Full Name
            </label>
            <input
              type="text"
              value={formValues.name}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
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
              value={formValues.phone}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              disabled={!isEditing}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFA500]/20 outline-none disabled:bg-gray-50"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            {error ? (
              <p className="text-sm text-red-500" role="alert">
                {error}
              </p>
            ) : null}
            {success ? (
              <p className="text-sm text-green-600">{success}</p>
            ) : null}
          </div>

          {isEditing && (
            <div className="md:col-span-2 mt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full md:w-auto px-8 py-3 bg-linear-to-r from-[#FFA500] to-[#FFD700] text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full md:w-auto px-8 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
