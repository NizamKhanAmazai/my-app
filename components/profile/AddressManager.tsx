import { useEffect, useState } from "react";
import { MapPin, Plus, Edit2, Trash2 } from "lucide-react";
import AddAddressModal from "./AddAddressModal"; // Import the new component

const SAVED_ADDRESSES = [
  {
    id: 1,
    isDefault: true,
    type: "Home",
    name: "John Doe",
    phone: "+92 300 1234567",
    address: "Apartment 4B, Silver Heights, Phase 6",
    city: "Lahore",
    country: "Pakistan",
  },
  {
    id: 2,
    isDefault: false,
    type: "Office",
    name: "John Doe",
    phone: "+92 321 7654321",
    address: "Tech Hub Plaza, 2nd Floor, Main Boulevard",
    city: "Karachi",
    country: "Pakistan",
  },
];

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddressManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Shipping Addresses</h3>
        <button
          onClick={() => setIsModalOpen(true)} // Open modal on click
          className="flex items-center gap-2 text-sm font-bold text-[#FFA500] hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAVED_ADDRESSES.map((addr) => (
          <div
            key={addr.id}
            className={`p-5 rounded-2xl border-2 transition-all ${
              addr.isDefault
                ? "border-[#FFA500] bg-orange-50/30"
                : "border-gray-100 bg-white hover:border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    addr.isDefault
                      ? "bg-[#FFA500] text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {addr.type}
                </span>
                {addr.isDefault && (
                  <span className="text-xs font-medium text-[#FFA500]">
                    Default Address
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit2 size={16} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-gray-900">{addr.name}</p>
              <p className="text-sm text-gray-500">{addr.phone}</p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {addr.address}, <br />
                {addr.city}, {addr.country}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[#FFA500]">
              <MapPin size={14} />
              <span className="text-xs font-semibold">Verified Location</span>
            </div>
          </div>
        ))}
      </div>
      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
