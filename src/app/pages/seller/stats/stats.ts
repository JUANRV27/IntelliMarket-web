import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { Category } from '../../../models/category-products';

interface CategoryStat {
  name: string;
  count: number;
  totalStock: number;
  totalValue: number;
  percentage: number;
}

@Component({
  selector: 'app-stats-seller',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './stats.html',
  styleUrl: './stats.css'
})
export class StatsSeller implements OnInit {
  private inventoryService = inject(InventoryService);
  private router = inject(Router);

  storeId = signal<string>('');
  productsInStock = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    const savedStoreId = localStorage.getItem('intellimarket.storeId');
    if (savedStoreId !== null) {
      this.storeId.set(savedStoreId);
      this.loadStatsData();
    } else {
      console.error('No se encontró storeId para cargar estadísticas. Redirigiendo...');
      this.router.navigate(['/auth/login']);
    }
  }

  loadStatsData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.inventoryService.getStockByStore(this.storeId()).subscribe({
      next: (data) => {
        this.productsInStock.set(data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar datos para estadísticas:', err);
        this.errorMessage.set('No se pudieron cargar los datos de la tienda para generar estadísticas.');
        this.isLoading.set(false);
      }
    });
  }

  // --- MÉTRICAS COMPUTADAS ---

  // Total de productos distintos
  totalProducts = computed(() => this.productsInStock().length);

  // Total de unidades físicas en stock
  totalStock = computed(() => {
    return this.productsInStock().reduce((sum, p) => sum + (p.stock || 0), 0);
  });

  // Valor total del inventario (precio * stock)
  totalValue = computed(() => {
    return this.productsInStock().reduce((sum, p) => {
      const price = p.price !== undefined ? p.price : (p.unitPrice || 0);
      return sum + (price * (p.stock || 0));
    }, 0);
  });

  // Cantidad de productos con stock crítico (<= 10)
  criticalStockCount = computed(() => {
    return this.productsInStock().filter(p => (p.stock || 0) <= 10).length;
  });

  // Lista de productos con stock crítico para mostrar alertas detalladas
  criticalStockProducts = computed(() => {
    return this.productsInStock()
      .filter(p => (p.stock || 0) <= 10)
      .sort((a, b) => (a.stock || 0) - (b.stock || 0));
  });

  // Precio promedio de los productos
  averagePrice = computed(() => {
    const list = this.productsInStock();
    if (list.length === 0) return 0;
    const sum = list.reduce((total, p) => {
      const price = p.price !== undefined ? p.price : (p.unitPrice || 0);
      return total + price;
    }, 0);
    return sum / list.length;
  });

  // Distribución por categoría
  categoryStats = computed<CategoryStat[]>(() => {
    const list = this.productsInStock();
    const categories = Object.values(Category);
    const totalCount = list.length;

    if (totalCount === 0) {
      return categories.map(cat => ({
        name: cat,
        count: 0,
        totalStock: 0,
        totalValue: 0,
        percentage: 0
      }));
    }

    const stats = categories.map(cat => {
      const catProducts = list.filter(p => p.category === cat);
      const count = catProducts.length;
      const totalStock = catProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
      const totalValue = catProducts.reduce((sum, p) => {
        const price = p.price !== undefined ? p.price : (p.unitPrice || 0);
        return sum + (price * (p.stock || 0));
      }, 0);
      const percentage = (count / totalCount) * 100;

      return {
        name: cat,
        count,
        totalStock,
        totalValue,
        percentage
      };
    });

    // Ordenar de mayor a menor según cantidad de productos
    return stats.sort((a, b) => b.count - a.count);
  });

  // Top 5 productos con mayor valor de inventario
  topValuedProducts = computed(() => {
    return [...this.productsInStock()]
      .map(p => {
        const price = p.price !== undefined ? p.price : (p.unitPrice || 0);
        return {
          ...p,
          resolvedPrice: price,
          calculatedValue: price * (p.stock || 0)
        };
      })
      .sort((a, b) => b.calculatedValue - a.calculatedValue)
      .slice(0, 5);
  });

  // Navegar a actualizar stock de un producto crítico
  goToStock(): void {
    this.router.navigate(['/seller/stock']);
  }
}
