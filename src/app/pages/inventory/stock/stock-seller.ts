import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service'; 
import { FormsModule } from '@angular/forms';
import { Category } from '../../../models/category-products';
import { DecimalPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-seller',
  standalone: true,
  imports: [FormsModule, DecimalPipe, CommonModule],
  templateUrl: './stock-seller.html',
  styleUrl: './stock-seller.css'
})
export class StockSeller implements OnInit {
  private inventoryService = inject(InventoryService);
  private router = inject(Router);

  // Estado del inventario real devuelto por la US-07
  inventoryStock = signal<any[]>([]);
  storeId = signal<string>('');

  // Filtros reactivos
  searchQuery = signal('');
  selectedCategory = signal('Todos');
  public categories = Object.values(Category);

  ngOnInit(): void {
    const savedStoreId = localStorage.getItem('intellimarket.storeId');
    if (savedStoreId !== null) {
      this.storeId.set(savedStoreId);
      this.loadStockReal();
    } else {
      console.error('No se encontró storeId para validar stock. Redirigiendo...');
      this.router.navigate(['/login']);
    }
  }

  loadStockReal(): void {
    console.log('[STOCK-SELLER] Invocando US-07 para la tienda:', this.storeId());
    this.inventoryService.getStockReal(this.storeId()).subscribe({
      next: (data) => {
        console.log('[STOCK-SELLER] Datos de stock crudos de IntelliJ:', data);
        this.inventoryStock.set(data);
      },
      error: (err) => console.error('Error al consultar stock real:', err)
    });
  }

  // Filtrado en tiempo real en memoria del cliente
  filteredStock = computed(() => {
    let list = this.inventoryStock();
    const query = this.searchQuery().trim().toLowerCase();

    if (query) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    const category = this.selectedCategory();
    if (category !== 'Todos') {
      list = list.filter(p => p.category === category);
    }

    return list;
  });

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  // Función de utilidad estética para alertar visualmente si un producto se está quedando sin unidades
  getStockStatusClass(stock: number): string {
    //if (stock <= 10) return 'status-danger';    // Alerta crítica
    if (stock <= 10) return 'status-warning';  // Alerta preventiva
    return 'status-success';                   // Stock saludable
  }

  goToCatalog(): void {
    this.router.navigate(['/seller/catalog']);
    }
}