export interface OrderItem {
  id: string;
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Payment {
  method: "CREDIT_CARD" | "COD";
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardHolder?: string;
}

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  landmark: string;
}

export interface Order {
  items: OrderItem[];
  customer: FormData;
  payment: Payment;
  subtotal: number;
  shippingFee: number;
  total: number;
}
