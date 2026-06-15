import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { ProductsRequest } from '../models/products-request';
import { ProductsResponse } from '../models/products-response';

// Interfaz para envolver la respuesta del HashMap de tu Java
export interface ApiResponseWrapper {
  message: string;
  data: ProductsResponse;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  
  // Ruta base que apunta a tu controlador de inventarios unificado (/api/v1/inventory)
  private baseUrl = `${environment.apiUrl}/inventory`;

  /**
   * US-05: Registrar un nuevo producto
   * POST: /api/v1/inventory/products?storeId={id}
   */
  createProduct(storeId: string, request: ProductsRequest): Observable<ApiResponseWrapper> {
    const params = new HttpParams().set('storeId', storeId);
    return this.http.post<ApiResponseWrapper>(`${this.baseUrl}/products`, request, { params });
  }

  /**
   * US-06: Edición de Producto y Stock
   * PUT: /api/v1/inventory/products/{productId}?storeId={id}
   */
  updateProduct(productId: string, storeId: string, request: ProductsRequest): Observable<ApiResponseWrapper> {
    const params = new HttpParams().set('storeId', storeId);
    console.log(`[HTTP PUT] Actualizando producto a: ${this.baseUrl}/products/${productId}?storeId=${storeId}`);
    return this.http.put<ApiResponseWrapper>(`${this.baseUrl}/products/${productId}`, request, { params });
  }

  /**
   * US-07: Consulta de stock real por tienda o bodega (Usado por Vendedor y Cliente)
   * GET: /api/v1/inventory/stock?storeId={id}
   */
  getStockByStore(storeId: string | number): Observable<any[]> {
    const params = new HttpParams().set('storeId', storeId.toString());
    return this.http.get<any[]>(`${this.baseUrl}/stock`, { params });
  }

  /**
   * US-08: Alertas de Stock Crítico
   * GET: /api/v1/inventory/alerts?storeId={id}
   */
  getCriticalStock(storeId: string | number): Observable<any> {
    const params = new HttpParams().set('storeId', storeId.toString());
    return this.http.get<any>(`${this.baseUrl}/alerts`, { params });
  }

  /**
   * Obtiene un producto específico de una tienda
   * GET: /api/v1/inventory/store/{storeId}/products/{productId}
   */
  getProductByIdAndStore(productId: string, storeId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/store/${storeId}/products/${productId}`);
  }

  /**
   * Utilidades locales y de otras épicas
   */
  getActualStoreId(): string {
    return localStorage.getItem('intellimarket.storeId') || '1';
  }

  getStoresByOwner(): Observable<any[]> {
    // Usando la variable de entorno para evitar problemas de hardcoding
    return this.http.get<any[]>(`${environment.apiUrl}/stores`);
  }
}