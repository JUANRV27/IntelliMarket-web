import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { SuppliersRequest } from '../models/suppliers-request';
import { SuppliersResponse } from '../models/suppliers-response';

export interface ApiResponseWrapper {
  message: string;
  data: SuppliersResponse;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/suppliers`;

  createSupplier(storeId: string, request: SuppliersRequest): Observable<ApiResponseWrapper> {
    const params = new HttpParams().set('storeId', storeId);
    return this.http.post<ApiResponseWrapper>(this.baseUrl, request, { params });
  }

  getSuppliersByStore(storeId: string): Observable<SuppliersResponse[]> {
    const params = new HttpParams().set('storeId', storeId);
    return this.http.get<SuppliersResponse[]>(this.baseUrl, { params });
  }
}