import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  // Inyectamos el servicio de forma pública para usarlo directo en el HTML
  cartService = inject(CartService);

  eliminarItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  vaciarCarrito() {
    if (confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
      this.cartService.clearCart();
    }
  }

  procederAlPago() {
    alert('¡Excelente elección! La pasarela de pago con PayPal se implementará en la próxima tarea [US-15].');
  }
}