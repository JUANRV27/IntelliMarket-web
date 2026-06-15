import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { ProductsRequest } from '../models/products-request';
import { ProductsResponse } from '../models/products-response';
import { InventoryResponse } from '../models/inventory-response';

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
 
  // Ruta base que apunta a tu controlador de inventarios
  private baseUrl = `${environment.apiUrl}/inventory`;

  /**
   * US-05: Registrar un nuevo producto
   * POST: /api/inventory/products?storeId={id}
   */
  createProduct(storeId: string, request: ProductsRequest): Observable<ApiResponseWrapper> {
    const params = new HttpParams().set('storeId', storeId);
    // Forzamos la cadena exacta combinando la url base con /products
    return this.http.post<ApiResponseWrapper>(`${this.baseUrl}/products`, request, { params });
  }

  /**
   * US-06: Edición de Producto y Stock
   * PUT: /api/inventory/products/{productId}?storeId={id}
   */
  updateProduct(productId: string, storeId: string, request: ProductsRequest): Observable<ApiResponseWrapper> {
    const params = new HttpParams().set('storeId', storeId);
    // Forzamos la cadena exacta combinando la url base con /products
    console.log(`[HTTP PUT] Actualizando producto a: ${this.baseUrl}/products/${productId}?storeId=${storeId}`);
    return this.http.put<ApiResponseWrapper>(`${this.baseUrl}/products/${productId}`, request, { params });
  }

  /**
   * US-07: Consulta de stock real por tienda o bodega
   * GET: /api/inventory/stock?storeId={id}
   */
  getStockByStore(storeId: string): Observable<ProductsResponse[]> {
    const params = new HttpParams().set('storeId', storeId);
    return this.http.get<ProductsResponse[]>(`${this.baseUrl}/stock`, { params });
  }

  /**
   * US-08: Alertas de Stock Crítico
   * GET: /api/inventory/alerts?storeId={id}
   * Nota: Como puede devolver un objeto con un mensaje de "vacío" o la lista, usamos 'any' para manejar el condicional en la vista.
   */
  getCriticalStock(storeId: string): Observable<any> {
    const params = new HttpParams().set('storeId', storeId);
    return this.http.get<any>(`${this.baseUrl}/alerts`, { params });
  }

  getActualStoreId(): string {
  return localStorage.getItem('intellimarket.storeId') || '1';
  }

  getStoresByOwner(): Observable<any[]> {
    // Ajusta esta URL según tu controlador de tiendas
    return this.http.get<any[]>(`http://localhost:8080/api/v1/stores`);
  }

  // Stock de tienda
  getStockReal(storeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stock`, {
      params: { storeId }
    });
  }

  getProductByIdAndStore(productId: string, storeId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/store/${storeId}/products/${productId}`);
  }
}