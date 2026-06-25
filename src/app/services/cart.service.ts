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

  // Único estado real de la aplicación (proviene de PostgreSQL)
  cartState = signal<CartResponse | null>(null);

  // Señales computadas de solo lectura para la UI
  cartItems = computed(() => this.cartState()?.items || []);

  totalItems = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.subtotal, 0)
  );

  /**
   * Carga el carrito del usuario autenticado directamente desde la base de datos (GET /api/v1/orders/cart/me)
   */
  loadCartFromBackend(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.baseUrl}/me`).pipe(
      tap(cart => this.cartState.set(cart))
    );
  }

  /**
   * Sincroniza la adición de productos con la DB de Spring Boot (POST /api/v1/orders/cart/items)
   */
  addToCartBackend(productId: number, storeId: number, quantity: number): Observable<CartResponse> {
    const currentCartId = this.cartState()?.id ?? null;

    const payload: AddToCartRequest = {
      cartId: currentCartId,
      productId,
      storeId,
      quantity
    };

    return this.http.post<CartResponse>(`${this.baseUrl}/items`, payload).pipe(
      tap(updatedCart => this.cartState.set(updatedCart))
    );
  }

  /**
   * Elimina un ítem del carrito (DELETE /api/v1/orders/cart/items/{itemId})
   */
  removeFromCartBackend(itemId: number): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.baseUrl}/items/${itemId}`).pipe(
      tap(updatedCart => this.cartState.set(updatedCart))
    );
  }

  /**
   * Limpia el carrito por completo (DELETE /api/v1/orders/cart)
   */
  clearCartBackend(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}`).pipe(
      tap(() => this.cartState.set(null))
    );
  }

  // ❌ ELIMINADO: checkoutCart() — apuntaba a /v1/orders/cart/checkout, ruta inexistente.
  // El checkout real se hace ahora con OrderService.checkout(), que pega a /v1/orders/checkout
  // (sin el segmento "/cart") y devuelve un array de órdenes (una por tienda).
}