import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { MarketStateService } from '../../services/market-state';
import { TokenService } from '../../services/token.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-layout-client',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout-client.html',
  styleUrl: './layout-client.css'
})
export class LayoutClient {
  router = inject(Router);
  stateService = inject(MarketStateService);
  
  // Inyectamos el servicio de manera pública
  cartService = inject(CartService);

  // Inyectamos los servicios de seguridad para el Navbar
  tokenService = inject(TokenService);
  private authService = inject(AuthService);

  onSearch(event: any): void {
    console.log('Search query:', event.target.value);
  }

  // Método para cerrar sesión y volver al inicio
  onLogout(): void {
    this.cartService.clearCart(); // Limpiar el carrito al cerrar sesión
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

