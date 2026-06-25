import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-layout-client',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout-client.html',
  styleUrls: ['./layout-client.css']
})
export class LayoutClient {
  authService = inject(AuthService);
  cartService = inject(CartService);
  tokenService = inject(TokenService);
  router = inject(Router);

  // Señal para controlar la apertura del menú desplegable
  menuAbierto = signal(false);

  toggleMenu(): void {
    this.menuAbierto.update(v => !v);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  onLogout(): void {
    this.cerrarMenu();
    this.cartService.clearCartBackend();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}