import { Order } from "@/types/profile";
import { ChevronRight } from "lucide-react";

const statusStyles = {
  Delivered: "bg-green-50 text-green-700 border-green-100",
  Shipped: "bg-blue-50 text-blue-700 border-blue-100",
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  Cancelled: "bg-red-50 text-red-700 border-red-100",
};

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-orange-200 transition-all group">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Order ID
          </p>
          <p className="font-mono font-bold text-gray-900">{order.id}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              Placed on
            </p>
            <p className="text-sm font-medium text-gray-700">{order.date}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[order.status]}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-50 pt-4">
        <div className="flex -space-x-3 overflow-hidden">
          {order.items.map((item, idx) => (
            <img
              key={idx}
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-lg border-2 border-white object-cover shadow-sm bg-gray-50"
            />
          ))}
          {order.items.length > 3 && (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border-2 border-white">
              +{order.items.length - 3}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-gray-400">Total Amount</p>
            <p className="text-lg font-extrabold text-gray-900">
              Rs. {order.total.toLocaleString()}
            </p>
          </div>
          <button className="p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-[#FFA500] group-hover:text-white transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
