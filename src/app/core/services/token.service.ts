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

  save(token: string, email: string, role: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.EMAIL_KEY, email);
    localStorage.setItem(this.ROLE_KEY, role);
    this.isLoggedIn.set(true);
  }

  clear() {
    localStorage.clear();
    this.isLoggedIn.set(false);
  }
}