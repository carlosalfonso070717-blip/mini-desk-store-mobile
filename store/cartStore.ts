import { create } from 'zustand';
import { CartItem } from '../types/cart';
import { Product } from '../types/product';

interface CartState {
  items: Record<number, CartItem>;
  increment: (product: Product) => void;
  decrement: (productId: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: {},

  increment: (product) =>
    set((state) => {
      const existing = state.items[product.id];
      const quantity = existing ? existing.quantity + 1 : 1;
      return {
        items: { ...state.items, [product.id]: { product, quantity } },
      };
    }),

  decrement: (productId) =>
    set((state) => {
      const existing = state.items[productId];
      if (!existing) return state;

      if (existing.quantity <= 1) {
        const items = { ...state.items };
        delete items[productId];
        return { items };
      }

      return {
        items: {
          ...state.items,
          [productId]: { ...existing, quantity: existing.quantity - 1 },
        },
      };
    }),

  removeItem: (productId) =>
    set((state) => {
      const items = { ...state.items };
      delete items[productId];
      return { items };
    }),

  clear: () => set({ items: {} }),
}));