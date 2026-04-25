// components/Checkout/OrderSummary.tsx
import { OrderItem } from "@/types/checkout";

export const OrderSummary = ({ items }: { items: OrderItem[] }) => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 ">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex-shrink-0 border border-gray-50 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-800 leading-tight">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500">
                  {item.variant} • Qty {item.quantity}
                </p>
              </div>
            </div>
            <p className="font-medium text-gray-700">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-6 border-t border-gray-100">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span>Rs{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Shipping</span>
          <span>Rs{shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-end pt-4">
          <span className="text-lg font-bold text-gray-800">Total</span>
          <div className="text-right">
            <span className="text-xs text-gray-400 block uppercase font-bold tracking-tighter">
              PKR
            </span>
            <span className="text-3xl font-black text-gray-900 tracking-tight">
              Rs{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
