import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service'; // Ajustar ruta

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-history.html',
  styleUrls: ['./purchase-history.css']
})
export class PurchaseHistoryComponent implements OnInit {
  private orderService = inject(OrderService);

  // Inicializamos el signal vacío, ya no hay datos falsos
  orders = signal<any[]>([]);

  startDate = signal('');
  endDate = signal('');

  // El filtro reactivo sigue funcionando exactamente igual
  filteredOrders = computed(() => {
    const start = this.startDate();
    const end = this.endDate();
    let result = this.orders();

    if (start) {
      // Cambiado 'o.createdAt' por 'o.date' que es la propiedad real mapeada
      result = result.filter(o => o.date !== 'Sin fecha' && o.date >= start);
    }
    if (end) {
      // Cambiado 'o.createdAt' por 'o.date'
      result = result.filter(o => o.date !== 'Sin fecha' && o.date <= end);
    }
    return result;
  });

  ngOnInit() {
    // Cuando la pantalla carga, le pedimos las órdenes reales al backend
    this.orderService.getPurchaseHistory().subscribe({
      next: (data) => {
        // Mapeamos los datos para que coincidan con el HTML si es necesario
        const mappedOrders = data.map(order => ({
          id: order.id,
          date: order.createdAt ? order.createdAt.split('T')[0] : 'Sin fecha', // Extraemos solo el YYYY-MM-DD
          total: order.totalAmount,
          status: order.status === 'COMPLETED' ? 'Completado' : (order.status === 'PENDING' ? 'Pendiente' : order.status),
          store: order.storeName || 'Tienda', // Ajusta esto según lo que mande tu OrderResponseDTO
          products: order.items || []
        }));
        
        // Guardamos las órdenes reales en el signal
        this.orders.set(mappedOrders);
      },
      error: (err) => {
        console.error('Error cargando el historial', err);
      }
    });
  }
}