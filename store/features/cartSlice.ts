import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string; // This should be a unique ID for the cart item entry (product + variant)
  productId: string;
  title: string;
  price: number;
  discountPrice: number | null;
  image: string;
  quantity: number;
  stockQuantity: number;
  selectedVariant?: string;
  brand?: string | null;
  sku: string;
  description: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.selectedVariant === action.payload.selectedVariant,
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + action.payload.quantity;
        existingItem.quantity = Math.min(
          newQuantity,
          existingItem.stockQuantity,
        );
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; selectedVariant?: string }>,
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.selectedVariant === action.payload.selectedVariant
          ),
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        selectedVariant?: string;
        quantity: number;
      }>,
    ) => {
      const item = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.selectedVariant === action.payload.selectedVariant,
      );
      if (item) {
        const newQuantity = item.quantity + action.payload.quantity;
        item.quantity = Math.max(1, Math.min(newQuantity, item.stockQuantity));
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
