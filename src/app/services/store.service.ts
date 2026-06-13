import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { StoreRequest } from '../models/store-request';
import { StoreResponse } from '../models/store-response';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/stores`;

  createStore(body: StoreRequest): Observable<StoreResponse> {
    return this.http.post<StoreResponse>(this.baseUrl, body);
  }
}