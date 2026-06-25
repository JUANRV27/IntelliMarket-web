import { OrderItemResponse } from './order-item-response';

export interface OrderResponse {
  id: number;
  status: string;
  storeName: string;
  storeId: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItemResponse[];
}