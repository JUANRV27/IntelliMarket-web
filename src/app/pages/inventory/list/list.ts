import { RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { ProductsResponse } from '../../../models/products-response';
import { InventoryResponse } from '../../../models/inventory-response';
import { TokenService } from '../../../services/token.service';
import { ProfileService } from '../../../services/profile.service';
import { ProfileResponse } from '../../../models/profile.model';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})

export class ListComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  // Variables de estado
  public products: ProductsResponse[] = [];
  public inventory: InventoryResponse[] = [];
  public alerts: ProductsResponse[] = [];
  public currentTab: 'all' | 'alerts' = 'all'; // Control de pestañas dinámicas
  public storeId: string = '1'; // Simulación de la tienda actual del vendedor
  public alertMessage: string = '';

  private tokenService = inject(TokenService);

  ngOnInit(): void {
    const storedId = localStorage.getItem('intellimarket.storeId');
    if (storedId) {
      this.storeId = storedId;
      this.loadStock();
      this.loadAlerts();
    } else {
      // Si no está, lo pedimos al perfil antes de cargar el inventario
      this.profileService.getOwnerProfile().subscribe({
        next: (profile: any) => {
          // Si el perfil trae el objeto store directamente o un storeId, lo usamos defensivamente
          const id = profile.storeId || (profile.store ? profile.store.id : null) || profile.userId;
          this.storeId = id.toString(); 
          
          localStorage.setItem('intellimarket.storeId', this.storeId);
          this.loadStock();
          this.loadAlerts();
        },
        error: () => {
          // Si el perfil falla por completo, significa que es una cuenta sin rol o colgada, redirigimos preventivamente
          alert('No se pudo identificar tu cuenta de vendedor. Redirigiendo a registro de tienda.');
          this.router.navigate(['/seller/store/create']);
        }
      });
    }
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
    this.router.navigate(['/seller/inventory/edit', productId]);
  }

  get displayList() {
    return this.currentTab === 'all' ? this.products : this.alerts;
  }
}