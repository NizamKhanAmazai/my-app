import { Camera, Star } from "lucide-react";

export default function ProfileHeader({ user }: { user: any }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar Upload Container */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full p-1 bg-linear-to-tr from-[#FFA500] to-[#FFD700]">
            <div className="w-full h-full rounded-full bg-white p-1">
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-[#FFA500] transition-colors">
            <Camera size={16} />
          </button>
        </div>

        {/* User Details */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FFA500] border border-orange-100">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {user.membership} Member
            </span>
          </div>
        </div>
      </div>

      {/* <button className="px-6 py-2.5 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 transition-all text-gray-700">
        Edit Profile
      </button> */}
    </div>
  );
}
