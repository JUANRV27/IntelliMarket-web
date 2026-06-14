import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { StoreRequest } from '../models/store-request';
import { StoreResponse } from '../models/store-response';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly http = inject(HttpClient);
  // environments.ts tiene 'http://localhost:8080/api', así que agregamos /v1/stores
  private readonly baseUrl = `${environment.apiUrl}/stores`;

  createStore(body: StoreRequest): Observable<StoreResponse> {
    return this.http.post<StoreResponse>(this.baseUrl, body);
  }

  // Datos de tienda del usuario autenticado
  getMyStore(): Observable<{ id: number; name: string }> {
    return this.http.get<{ id: number; name: string }>(`${this.baseUrl}/my-store`);
  }

  // Obtener datos de la tienda por su ID
  getStoreById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Consumir el endpoint PUT de IntelliJ
  updateStore(id: string, storeData: { name: string; address: string; district: string }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, storeData);
  }
}