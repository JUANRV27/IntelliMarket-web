import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { AddToCartRequest } from '../models/add-to-cart-request';
import { CartResponse } from '../models/cart-response';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1/orders/cart`;

  cartState = signal<CartResponse | null>(null);

  cartItems = computed(() => this.cartState()?.items || []);

  totalItems = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.subtotal, 0)
  );

  loadCartFromBackend(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.baseUrl}/me`).pipe(
      tap(cart => this.cartState.set(cart))
    );
  }

  addToCartBackend(productId: number, storeId: number, quantity: number): Observable<CartResponse> {
    const currentCartId = this.cartState()?.id;
    const cartId = currentCartId ? Number(currentCartId) : 0;

    const payload: AddToCartRequest = {
      cartId,
      productId: Number(productId),
      storeId: Number(storeId),
      quantity: Number(quantity)
    };

    return this.http.post<CartResponse>(`${this.baseUrl}/items`, payload).pipe(
      tap(updatedCart => this.cartState.set(updatedCart))
    );
  }

  /**
   * NUEVO: actualiza la cantidad de un item ya existente en el carrito.
   * Solo necesita el "itemId" (el id propio del CartItem, ya disponible en
   * CartItemResponse.id) y la nueva cantidad — NO requiere productId ni storeId,
   * que es justo el problema que tenías: CartItemResponse no expone esos campos.
   */
  updateItemQuantity(itemId: number, quantity: number): Observable<CartResponse> {
    return this.http.patch<CartResponse>(`${this.baseUrl}/items/${itemId}`, { quantity }).pipe(
      tap(updatedCart => this.cartState.set(updatedCart))
    );
  }

  removeFromCartBackend(itemId: number): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.baseUrl}/items/${itemId}`).pipe(
      tap(updatedCart => this.cartState.set(updatedCart))
    );
  }

  clearCartBackend(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}`).pipe(
      tap(() => this.cartState.set(null))
    );
  }
}