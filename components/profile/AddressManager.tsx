import { useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Home,
  Briefcase,
} from "lucide-react";
import AddAddressModal from "./AddAddressModal";
import { useSession } from "next-auth/react";

interface Address {
  id: string;
  isDefault: boolean;
  type?: string;
  fullName: string;
  phoneNumber: string;
  fullAddress: string;
  city: string;
  country: string;
}

export default function AddressManager() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchAddresses();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      if (!id) {
        alert("Invalid address ID");
        return;
      }
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        alert("Address deleted successfully");
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      } else {
        if (data.error === "RESTRICED_DELETE") {
          alert(data.message);
        } else {
          alert(
            "Failed to delete address: " +
              (data.message || data.error || "Unknown error"),
          );
        }
      }
    } catch (error) {
      alert("Something went wrong while deleting");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Shipping Addresses</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-sm font-bold text-[#FFA500] hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#FFA500] animate-spin" />
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
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
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      addr.isDefault
                        ? "bg-[#FFA500] text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {addr.type === "Office" ? (
                      <Briefcase size={10} />
                    ) : (
                      <Home size={10} />
                    )}
                    {addr.type || "Default"}
                  </span>
                  {addr.isDefault && (
                    <span className="text-xs font-medium text-[#FFA500]">
                      Default Address
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {/* <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit2 size={16} />
                  </button> */}
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-gray-900">{addr.fullName}</p>
                <p className="text-sm text-gray-500">{addr.phoneNumber}</p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {addr.fullAddress}, <br />
                  {addr.city}
                  {addr.country ? `, ${addr.country}` : ""}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[#FFA500]">
                <MapPin size={14} />
                <span className="text-xs font-semibold">Verified Location</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
          <p className="text-gray-400">No addresses saved yet.</p>
        </div>
      )}

      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchAddresses(); // Refresh list after adding
        }}
      />
    </div>
  );
}
