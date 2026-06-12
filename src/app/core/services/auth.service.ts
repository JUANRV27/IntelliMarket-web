import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../shared/models/auth.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly baseUrl = `${environment.apiUrl}/v1/auth`;

  /**
   * Realiza el login genérico. Guarda el Token JWT básico y limpia estados previos.
   */
  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, body).pipe(
      tap(res => {
        // Guardamos las credenciales base que vienen del backend de manera síncrona
        this.tokenService.save(res.token, res.email, res.role, res.id.toString());
      })
    );
  }

  /**
   * Registro único genérico para cualquier rol (Vendedor o Cliente)
   */
  register(body: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, body);
  }

  /**
   * Cierre de sesión centralizado
   */
  logout(): void {
    this.tokenService.clear();
  }

  // --- MÉTODOS DE AYUDA GENÉRICOS (Helpers de Rol) ---
  /*isSeller(): boolean {
    return this.tokenService.role() === 'SELLER';
  }

  isCustomer(): boolean {
    return this.tokenService.role() === 'CUSTOMER';
  }*/
}