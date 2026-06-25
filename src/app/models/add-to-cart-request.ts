export interface AddToCartRequest {
  productId: number;
  cartId?: number | null;
  storeId: number;
  quantity: number;
}