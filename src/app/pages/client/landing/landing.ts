import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketStateService, Product } from '../../../services/market-state';
import { DecimalPipe } from '@angular/common';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  stateService = inject(MarketStateService);
  cartService = inject(CartService);

  get featuredProducts(): Product[] {
    return this.stateService.products().filter(p => p.isVisible);
  }

  get clientReviews() {
    return this.stateService.reviews();
  }

  scrollToProducts(element: HTMLElement): void {
    element.scrollIntoView({ behavior: 'smooth' });
  }

  // Corregido: Un solo argumento para encajar perfectamente con tu landing.html
  agregarAlCarrito(prod: any): void {
    const productId = Number(prod.id);
    const storeId = Number(prod.storeId || 1); // Fallback dinámico para evitar el TS2339

    this.cartService.addToCartBackend(productId, storeId, 1).subscribe({
      next: () => {
        alert(`¡${prod.name} agregado al carrito en el servidor!`);
      },
      error: (err) => {
        console.error('Error al agregar al carrito desde el landing:', err);
      }
    });
  }
}