import { RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { ProductsResponse } from '../../../models/products-response';
import { InventoryResponse } from '../../../models/inventory-response';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})

export class InventoryListComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private router = inject(Router);

  // Variables de estado
  public products: ProductsResponse[] = [];
  public inventory: InventoryResponse[] = [];
  public alerts: ProductsResponse[] = [];
  public currentTab: 'all' | 'alerts' = 'all'; // Control de pestañas dinámicas
  public storeId: string = '1'; // Simulación de la tienda actual del vendedor
  public alertMessage: string = '';

  ngOnInit(): void {
    this.loadStock();
    this.loadAlerts();
  }

  loadStock(): void {
    this.inventoryService.getStockByStore(this.storeId).subscribe({
      next: (res) => this.products = res,
      error: (err) => console.error('Error al cargar inventario:', err)
    });
  }

  loadAlerts(): void {
    this.inventoryService.getCriticalStock(this.storeId).subscribe({
      next: (res) => {
        // Tu backend devuelve un Map con 'message' si está vacío, o una List si hay alertas
        if (Array.isArray(res)) {
          this.alerts = res;
          this.alertMessage = '';
        } else if (res && res.message) {
          this.alerts = [];
          this.alertMessage = res.message;
        }
      },
      error: (err) => console.error('Error al cargar alertas:', err)
    });
  }

  changeTab(tab: 'all' | 'alerts'): void {
    this.currentTab = tab;
  }

  onEdit(productId: string): void {
    this.router.navigate(['/inventory/edit', productId]);
  }
}