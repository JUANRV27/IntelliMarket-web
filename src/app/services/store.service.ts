import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StoreRequest } from '../models/store-request';
import { StoreResponse } from '../models/store-response';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/stores`;

  createStore(body: StoreRequest): Observable<StoreResponse> {
    return this.http.post<StoreResponse>(this.baseUrl, body);
  }

  getMyStore(): Observable<{ id: number; name: string }> {
    return this.http.get<{ id: number; name: string }>(`${this.baseUrl}/my-store`);
  }

  getStoreById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  updateStore(id: string, storeData: { name: string; address: string; district: string }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, storeData);
  }
}