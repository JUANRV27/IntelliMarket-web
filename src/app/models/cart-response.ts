import { CartItemResponse } from './cart-item-response';

export interface CartResponse {
  id: number; 
  items: CartItemResponse[];
}