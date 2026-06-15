import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environments';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  // ✅ FIX: ruta correcta con /v1/
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, body).pipe(
      tap(res => {
        this.tokenService.save(res.token, res.email, res.role);
      })
    );
  }

  register(body: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, body);
  }

  logout(): void {
    this.tokenService.clear();
  }
}