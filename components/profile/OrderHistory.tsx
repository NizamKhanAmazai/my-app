import OrderCard from "./OrderCard";
import { Order } from "@/types/profile";

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-77210",
    date: "April 12, 2026",
    total: 12500,
    status: "Delivered",
    items: [
      {
        name: "Aviator Gold Classic",
        image:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Blue Light Blockers",
        image:
          "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
  {
    id: "ORD-88392",
    date: "April 15, 2026",
    total: 8900,
    status: "Shipped",
    items: [
      {
        name: "Wayfarer Matte Black",
        image:
          "https://images.unsplash.com/photo-1511499767390-a8a19799ef81?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
];

export default function OrderHistory() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
        <span className="text-sm text-gray-500">
          {MOCK_ORDERS.length} orders found
        </span>
      </div>

      {MOCK_ORDERS.length > 0 ? (
        MOCK_ORDERS.map((order) => <OrderCard key={order.id} order={order} />)
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
          <p className="text-gray-400">No orders placed yet.</p>
        </div>
      )}
    </div>
  );
}
