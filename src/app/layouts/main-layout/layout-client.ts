import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MarketStateService } from '../../services/market-state';
import { TokenService } from '../../services/token.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout-client',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout-client.html',
  styleUrl: './layout-client.css'
})
export class LayoutClient {
  router = inject(Router);
  stateService = inject(MarketStateService);
  
  // Inyectamos los servicios de seguridad para el Navbar
  tokenService = inject(TokenService);
  private authService = inject(AuthService);

  onSearch(event: any): void {
    console.log('Search query:', event.target.value);
  }

  // Método para cerrar sesión y volver al inicio
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}