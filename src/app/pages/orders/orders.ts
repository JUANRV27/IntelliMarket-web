import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { OrderService } from '../../services/order.service';
import { OrderResponse } from '../../models/order-response';
import { OrderItemResponse } from '../../models/order-item-response';

/*@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './orders.html',
    styleUrl: './orders.css'
})
export class OrdersComponent {
    // Inyectamos el servicio de forma pública para usarlo directo en el HTML
    orderService = inject(OrderService);*/
