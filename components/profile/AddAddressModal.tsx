"use client";
import { X, MapPin, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAddressModal({
  isOpen,
  onClose,
}: AddAddressModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    fullAddress: "",
    landmark: "",
  });
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "hidden";
      }
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "unset";
      }
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isDefault }),
      });

      if (res.ok) {
        alert("Address added successfully");
        onClose();
        setFormData({
          fullName: "",
          phoneNumber: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          fullAddress: "",
          landmark: "",
        });
        setIsDefault(false);
      } else {
        alert("Failed to add address");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end md:items-center justify-center transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div
        className={`
        relative w-full bg-white shadow-2xl overflow-hidden
        max-w-2xl max-h-[90vh] overflow-y-auto z-10
        rounded-t-[2.5rem] md:rounded-2xl
        ${isOpen ? "animate-water-drop" : "translate-y-full md:scale-90 opacity-0"}
      `}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="ripple-effect" />
        </div>

        <div className="relative z-20">
          <div className="sticky top-0 bg-white/80 backdrop-blur-sm px-6 py-5 flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-[#FFA500] to-[#FFD700] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
                <MapPin size={22} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Add Shipping Address
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-gray-100 rounded-full transition-all hover:rotate-90"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  className="modern-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+92 XXX XXXXXXX"
                  className="modern-input"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>City</label>
                <input
                  id="country"
                  type="text"
                  placeholder="Pakistan"
                  className="modern-input"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>City</label>
                <input
                  id="city"
                  type="text"
                  placeholder="Lahore"
                  className="modern-input"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>State / Province</label>
                <input
                  id="state"
                  type="text"
                  placeholder="Punjab"
                  className="modern-input"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>Postal Code</label>
                <input
                  id="postalCode"
                  type="text"
                  placeholder="54000"
                  className="modern-input"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Full Address</label>
              <textarea
                id="fullAddress"
                rows={2}
                placeholder="Building, Street, Area..."
                className="modern-input resize-none"
                value={formData.fullAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Landmark (Optional)</label>
              <input
                id="landmark"
                type="text"
                placeholder="e.g. Near Orange Line Station"
                className="modern-input"
                value={formData.landmark}
                onChange={handleChange}
              />
            </div>

            <div
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${isDefault ? "border-[#FFA500] bg-orange-50/20" : "border-gray-50 bg-gray-50/50"}`}
              onClick={() => setIsDefault(!isDefault)}
            >
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Default Address
                </p>
                <p className="text-xs text-gray-500">
                  Fast-track your checkout with this address
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isDefault ? "bg-[#FFA500] border-[#FFA500]" : "bg-white border-gray-200"}`}
              >
                {isDefault && (
                  <Check size={14} className="text-white" strokeWidth={4} />
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-2 py-4 bg-linear-to-r from-[#FFA500] to-[#FFD700] text-white font-bold rounded-2xl shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? "Saving..." : "Save & Continue"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
              >
                Discard
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes water-drop-mobile {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          60% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes water-drop-desktop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-water-drop {
          animation: water-drop-mobile 0.5s cubic-bezier(0.23, 1, 0.32, 1)
            forwards;
        }
        @media (min-width: 768px) {
          .animate-water-drop {
            animation: water-drop-desktop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)
              forwards;
          }
        }
        .ripple-effect {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200px;
          height: 200px;
          background: radial-gradient(
            circle,
            rgba(255, 165, 0, 0.2) 0%,
            transparent 70%
          );
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple 1.2s ease-out infinite;
        }
        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
        }
        .modern-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background: #f8fafc;
          border: 2px solid #f1f5f9;
          border-radius: 1.25rem;
          font-size: 0.95rem;
          transition: all 0.3s;
        }
        .modern-input:focus {
          outline: none;
          background: white;
          border-color: #ffa500;
          box-shadow: 0 0 0 4px rgba(255, 165, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
