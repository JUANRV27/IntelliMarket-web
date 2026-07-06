import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { OrderResponse } from '../../models/order-response';
import { ToastService } from '../../services/toast.service';
import { ProfileService } from '../../services/profile.service';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private profileService = inject(ProfileService);

  public showPaymentModal = signal<boolean>(false);
  public isCheckoutLoading = signal<boolean>(false);
  public isProcessingTransaction = signal<boolean>(false);

  // Puede haber VARIAS órdenes (una por tienda) generadas en un solo checkout
  private pendingOrders: OrderResponse[] = [];
  private currentPaymentIndex = 0;
  // Modal para advertir al usuario que debe registrar su teléfono antes de poder comprar
  public showPhoneWarningModal = signal<boolean>(false);
  public isUpdatingQuantity = signal<boolean>(false);

  ngOnInit() {
    this.cartService.loadCartFromBackend().subscribe({
      error: (err) => console.error('Error al recuperar el carrito del servidor:', err)
    });
  }

  // FIX: antes intentaba usar item.productId / item.storeId, que NO existen
  // en CartItemResponse (solo existen en AddToCartRequest). Ahora usamos
  // el nuevo endpoint PATCH que solo necesita el id propio del CartItem.
  actualizarCantidad(item: any, cambio: number) {
    const nuevaCantidad = item.quantity + cambio;

    if (nuevaCantidad < 1) {
      this.eliminarItem(item.id);
      return;
    }

    this.isUpdatingQuantity.set(true);

    this.cartService.updateItemQuantity(item.id, nuevaCantidad).subscribe({
      next: () => {
        this.isUpdatingQuantity.set(false);
      },
      error: (err) => {
        this.isUpdatingQuantity.set(false);
        console.error('🔴 Error al modificar la cantidad:', err);
        this.toastService.error(err.error?.message || 'No hay suficiente stock en bodega para añadir más.');
      }
    });
  }

  eliminarItem(itemId: number) {
    this.cartService.removeFromCartBackend(itemId).subscribe();
  }

  vaciarCarrito() {
    if (confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
      this.cartService.clearCartBackend().subscribe();
    }
  }

  // PASO 1: crea la(s) orden(es) agrupando por tienda y ABRE el modal de pago.
  // Esto NO vacía el carrito todavía — eso ocurre en el backend al confirmar el pago.
  procederAlPago() {
    if (this.cartService.cartItems().length === 0) {
      this.toastService.error('No hay productos en tu carrito de compras.');
      return;
    }

    this.isCheckoutLoading.set(true);

    // Validamos que el cliente tenga teléfono y dirección registrados antes del Checkout
    this.profileService.getCustomerProfile().subscribe({
      next: (profile) => {
        if (!profile || !profile.phone || !profile.address || profile.address.trim() === '' || 
        profile.phone.trim() === '') {
          this.isCheckoutLoading.set(false);
          
          this.showPhoneWarningModal.set(true);
          return;
        }

        // Si pasó la validación, procedemos con el flujo de reserva de stock normal
        this.ejecutarCheckoutTransaccional();
      },
      error: (err) => {
        this.isCheckoutLoading.set(false);
        console.error('🔴 Error al validar perfil del cliente antes del pago:', err);
        this.toastService.error('No pudimos validar tus datos de entrega. Intenta nuevamente.');
      }
    });
  }

  irAlPerfil() {
    this.showPhoneWarningModal.set(false);
    // Cambia la ruta a '/profile' o como esté mapeado el ProfileCustomer en tus rutas hijas
    this.router.navigate(['/profile']); 
  }

  cerrarModalAdvertencia() {
    this.showPhoneWarningModal.set(false);
  }

  private ejecutarCheckoutTransaccional() {
    this.orderService.checkout().subscribe({
      next: (orders: OrderResponse[]) => {
        this.pendingOrders = orders;
        this.currentPaymentIndex = 0;
        console.log(`✅ Se generaron ${orders.length} orden(es):`, orders);

        this.isCheckoutLoading.set(false);
        this.showPaymentModal.set(true);
      },
      error: (err) => {
        this.isCheckoutLoading.set(false);
        console.error('🔴 Error en checkout:', err.error);
        this.toastService.error('Error en checkout: ' + (err.error?.message || 'Inconsistencia de stock.'));
      }
    });
  }

  // PASO 2: el modal llama a ESTE único método, sea éxito o fallo.
  // Recorre cada orden pendiente y actualiza su estado de pago una por una.
  procesarTransaccionSimulada(exito: boolean) {
    if (this.pendingOrders.length === 0) return;

    this.isProcessingTransaction.set(true);
    const estadoEnum = exito ? 'COMPLETED' : 'CANCELLED';

    setTimeout(() => {
      this.procesarSiguientePago(estadoEnum, exito);
    }, 1500);
  }

  cancelarPasarelaDePago() {
    this.showPaymentModal.set(false);
    this.isCheckoutLoading.set(false);
    this.isProcessingTransaction.set(false);
    
    // Opcional: Volvemos a sincronizar por seguridad local
    this.cartService.loadCartFromBackend().subscribe();
    
    //this.toastService.info('Compra pausada. Puedes modificar tus cantidades o continuar revisando el catálogo.');
  }

  private procesarSiguientePago(estadoEnum: 'COMPLETED' | 'CANCELLED', exito: boolean) {
    if (this.currentPaymentIndex >= this.pendingOrders.length) {
      // Todas las órdenes ya fueron procesadas
      this.isProcessingTransaction.set(false);
      this.showPaymentModal.set(false);

      if (exito) {
        this.toastService.success(`¡Pago procesado con éxito! Se generaron ${this.pendingOrders.length} orden(es).`);
        this.cartService.cartState.set(null); // el carrito ya fue vaciado en el backend al hacer checkout()
        this.router.navigate(['/history']);
      } else {
        this.toastService.error('Transacción rechazada. El stock reservado ha sido devuelto al inventario.');
        this.cartService.loadCartFromBackend().subscribe();
      }

      this.pendingOrders = [];
      this.currentPaymentIndex = 0;
      return;
    }

    const order = this.pendingOrders[this.currentPaymentIndex];

    this.orderService.processPayment(order.id, estadoEnum).subscribe({
      next: () => {
        this.currentPaymentIndex++;
        this.procesarSiguientePago(estadoEnum, exito);
      },
      error: (err) => {
        this.isProcessingTransaction.set(false);
        this.toastService.error(`Error procesando el pago de la orden #${order.id}: ` + (err.error?.message || err.message));
      }
    });
  }
}