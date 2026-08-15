import { Product } from './product';

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartLine {
    productId: number;
    product: Product;
    quantity: number;
    subtotal: number;
}
