"use client";
import { X, MapPin, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAddressModal({
  isOpen,
  onClose,
}: AddAddressModalProps) {
  const [isDefault, setIsDefault] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300); // Wait for animation
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end md:items-center justify-center transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`
        relative w-full bg-white shadow-2xl overflow-hidden
        max-w-2xl max-h-[90vh] overflow-y-auto z-10
        /* Mobile: Bottom Sheet Styles */
        rounded-t-[2.5rem] md:rounded-2xl
        /* Animation Logic */
        ${isOpen ? "animate-water-drop" : "translate-y-full md:scale-90 opacity-0"}
      `}
      >
        {/* The Water Ripple Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="ripple-effect" />
        </div>

        {/* Content (Z-indexed above ripple) */}
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

          <form className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="modern-input"
                  required
                />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+92 XXX XXXXXXX"
                  className="modern-input"
                  required
                />
              </div>
              <div className="input-group">
                <label>Country</label>
                <input
                  type="text"
                  placeholder="Pakistan"
                  className="modern-input"
                  required
                />
              </div>
              <div className="input-group">
                <label>City</label>
                <input
                  type="text"
                  placeholder="Lahore"
                  className="modern-input"
                  required
                />
              </div>
              <div className="input-group">
                <label>State / Province</label>
                <input
                  type="text"
                  placeholder="Punjab"
                  className="modern-input"
                />
              </div>
              <div className="input-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  placeholder="54000"
                  className="modern-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Full Address</label>
              <textarea
                rows={2}
                placeholder="Building, Street, Area..."
                className="modern-input resize-none"
                required
              />
            </div>

            <div className="input-group">
              <label>Landmark (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Near Orange Line Station"
                className="modern-input"
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
                className="flex-2 py-4 bg-linear-to-r from-[#FFA500] to-[#FFD700] text-white font-bold rounded-2xl shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Save & Continue
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
        /* The "Water Drop" Animation */
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

        /* The Ripple Effect */
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

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.7rem;
          font-weight: 800;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-left: 0.25rem;
        }

        .modern-input {
          width: 100%;
          padding: 0.8rem 1.25rem;
          background-color: #f9fafb;
          border: 1px solid #f3f4f6;
          border-radius: 1rem;
          font-size: 0.95rem;
          transition: all 0.2s;
          outline: none;
        }

        .modern-input:focus {
          background-color: #fff;
          border-color: #ffa500;
          box-shadow: 0 0 0 4px rgba(255, 165, 0, 0.08);
        }
      `}</style>
    </div>
  );
}
