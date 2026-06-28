import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environments';
import { ProductsRequest } from '../models/products-request';
import { ProductsResponse } from '../models/products-response';
import { Review, ReviewRequest } from '../models/review.model';

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
  private baseUrl = `${environment.apiUrl}/v1/inventory`;

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
   * Obtiene productos de TODAS las tiendas
   * Combina los productos de todas las tiendas disponibles
   */
  getAllProductsFromAllStores(): Observable<any[]> {
    // Primero obtenemos todas las tiendas
    return this.http.get<any[]>(`${environment.apiUrl}/v1/stores`).pipe(
      switchMap((stores: any[]) => {
        // Si no hay tiendas, retornamos array vacío
        if (!stores || stores.length === 0) {
          return of([]);
        }

        // Creamos un array de peticiones (una por cada tienda)
        const productRequests = stores.map(store => 
          this.getStockByStore(store.id).pipe(
            map((products: any[]) => {
              if (!products) return [];
              return products.map(p => ({
                ...p,
                storeId: p.storeId || p.store?.id || store.id
              }));
            }),
            catchError(() => of([])) // Si falla una tienda, retornamos array vacío para esa tienda
          )
        );

        // Ejecutamos todas las peticiones en paralelo
        return forkJoin(productRequests).pipe(
          map((results: any[][]) => {
            // Combinamos todos los arrays de productos en uno solo
            return results.flat();
          })
        );
      }),
      catchError(() => of([])) // Si falla obtener tiendas, retornamos array vacío
    );
  }

  /**
   * Utilidades locales y de otras épicas
   */
  getActualStoreId(): string {
  return localStorage.getItem('intellimarket.storeId') || '1'; // Valor por defecto si no se encuentra el storeId
  }

  getStoresByOwner(): Observable<any[]> {
    // FIX: faltaba el /v1/ — el backend expone /api/v1/stores, no /api/stores
    return this.http.get<any[]>(`${environment.apiUrl}/v1/stores`);
  }
  /**
   * Obtiene las reseñas de un producto específico
   * GET: /api/v1/reviews/product/{productId}
   */
  getProductReviews(productId: string | number): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/v1/reviews/product/${productId}`).pipe(
      catchError(() => of([])) // Retorna array vacío si falla
    );
  }

  /**
   * Crea una nueva reseña para un producto
   * POST: /api/v1/reviews
   */
  createProductReview(review: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${environment.apiUrl}/v1/reviews`, review);
  }}