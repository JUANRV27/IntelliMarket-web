import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { TokenService } from '../../services/token.service';
import { ChatBubble } from '../../shared/components/chat-bubble/chat-bubble';

@Component({
  selector: 'app-layout-client',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatBubble],   // <- CommonModule para *ngIf de la burbuja
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