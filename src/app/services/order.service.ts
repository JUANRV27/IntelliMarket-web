import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments'; // Ajustar ruta
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1/orders`; // Verifica tu controlador en Java

  // Angular mandará el token JWT automáticamente gracias a tu interceptor.
  // El backend extraerá el email de ese token y llamará a getOrderHistoryByEmail()
  getPurchaseHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/history`);
  }
}