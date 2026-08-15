import { useCartStore } from '../store/cartStore';
import { CartLine } from '../types/cart';
import { Product } from '../types/product';

export function useCartItem(product: Product) {
  const quantity = useCartStore((state) => state.items[product.id]?.quantity ?? 0);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);

  return {
    quantity,
    increment: () => increment(product),
    decrement: () => decrement(product.id),
  };
}

export function useCartSummary() {
  const items = useCartStore((state) => state.items);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);

  const lines: CartLine[] = Object.values(items).map((item) => ({
    productId: item.product.id,
    product: item.product,
    quantity: item.quantity,
    subtotal: item.product.price * item.quantity,
  }));

  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);

  return { lines, total, increment, decrement, removeItem };
}

export function useCartBadge() {
  return useCartStore((state) =>
    Object.values(state.items).reduce((sum, item) => sum + item.quantity, 0),
  );
}