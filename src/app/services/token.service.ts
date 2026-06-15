import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'intellimarket.token';
  private readonly EMAIL_KEY = 'intellimarket.email';
  private readonly ROLE_KEY = 'intellimarket.role';

  // Señales reactivas
  token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  email = signal<string | null>(localStorage.getItem(this.EMAIL_KEY));
  role = signal<string | null>(localStorage.getItem(this.ROLE_KEY));

  // Estado de login calculado automáticamente
  isLoggedIn = computed(() => !!this.token());

  save(token: string, email: string, role: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.EMAIL_KEY, email);
    localStorage.setItem(this.ROLE_KEY, role);

    // Actualizamos las señales
    this.token.set(token);
    this.email.set(email);
    this.role.set(role);
  }

  clear() {
    localStorage.clear();
    this.token.set(null);
    this.email.set(null);
    this.role.set(null);
  }

  getRole(): string | null {
    return this.role();

  }
}