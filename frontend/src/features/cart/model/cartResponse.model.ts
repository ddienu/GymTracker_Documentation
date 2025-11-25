import { CartItem } from "./cartItems.model";

export interface CartResponse{
    cart_id: number,
    items: CartItem[],
    total: number
}