import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { CustomerProfileRequest, OwnerProfileRequest, ProfileResponse } from '../../shared/models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  
  // Usamos la URL base configurada en tus environments
  private readonly baseUrl = `${environment.apiUrl}/profiles`;

  // --- MÉTODOS PARA EL DUEÑO (SELLER) ---
  getOwnerProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.baseUrl}/owner/me`);
  }

  updateOwnerProfile(body: OwnerProfileRequest): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(`${this.baseUrl}/owner/me`, body);
  }

  // --- MÉTODOS PARA EL CLIENTE (CUSTOMER) ---
  getCustomerProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.baseUrl}/customer/me`);
  }

  updateCustomerProfile(body: CustomerProfileRequest): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(`${this.baseUrl}/customer/me`, body);
  }
}