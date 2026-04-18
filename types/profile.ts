export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  membership: "Standard" | "Premium" | "VIP";
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: { name: string; image: string }[];
}
