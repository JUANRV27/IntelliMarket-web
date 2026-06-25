import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { OrderResponse } from '../models/order-response';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1/orders`;
  // FIX: faltaba el /v1/ — el backend expone /api/v1/payments/..., no /api/payments/...
  private paymentsUrl = `${environment.apiUrl}/v1/payments`;

  getPurchaseHistory(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/history`);
  }

  /**
   * El backend agrupa el carrito por la tienda real de cada producto
   * y genera una orden independiente por cada tienda. Por eso devuelve un array.
   */
  checkout(): Observable<OrderResponse[]> {
    return this.http.post<OrderResponse[]>(`${this.baseUrl}/checkout`, {});
  }

  processPayment(orderId: number, status: 'COMPLETED' | 'CANCELLED'): Observable<any> {
    const payload = { status: status };
    return this.http.patch<any>(`${this.paymentsUrl}/order/${orderId}`, payload);
  }
}