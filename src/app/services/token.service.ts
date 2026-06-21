import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'intellimarket.token';
  private readonly EMAIL_KEY = 'intellimarket.email';
  private readonly ROLE_KEY = 'intellimarket.role';

  isLoggedIn = signal<boolean>(!!this.token);

  get token(): string | null { return localStorage.getItem(this.TOKEN_KEY); }
  get email(): string | null { return localStorage.getItem(this.EMAIL_KEY); }
  get role(): string | null { return localStorage.getItem(this.ROLE_KEY); }

  getRole(): string | null {
    return this.role;
  }

  save(token: string, email: string, role: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.EMAIL_KEY, email);
    localStorage.setItem(this.ROLE_KEY, role);
    this.isLoggedIn.set(true);
  }

  clear() {
    // Limpiar solo datos de sesión, NO el carrito
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    // Nota: NO limpiamos 'intellimarket.cart_items' para que persista el carrito
    this.isLoggedIn.set(false);
  }
}