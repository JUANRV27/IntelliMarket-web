import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { MarketStateService } from '../../../services/market-state';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-catalog-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog-client.html',
  styleUrl: './catalog-client.css'
})
export class CatalogClient implements OnInit {
  private inventoryService = inject(InventoryService);
  private marketStateService = inject(MarketStateService);
  private cartService = inject(CartService);

  // Estados para los filtros y búsqueda
  searchQuery = signal('');
  selectedCategory = signal('Todos');
  
  // Lista raw de productos que traeremos del backend o local
  products = signal<any[]>([]);
  loading = signal(true);

  // Lista de categorías únicas para los botones de filtro
  categories = ['Todos', 'Abarrotes', 'Bebidas', 'Lácteos', 'Limpieza', 'Otros'];

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading.set(true);
    // Intentamos recuperar el storeId del localStorage para ver los productos de la bodega
    const storeId = localStorage.getItem('intellimarket.storeId') || '1';

    this.inventoryService.getStockByStore(storeId).subscribe({
      next: (data: any[]) => {
        // Si el backend responde con éxito, usamos sus productos reales
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.warn('Backend offline o sin tienda. Usando productos locales por defecto.', err);
        // FALLBACK: Si falla el backend, cargamos los productos estáticos del MarketState
        const locales = this.marketStateService.products().filter(p => p.isVisible);
        this.products.set(locales);
        this.loading.set(false);
      }
    });
  }

  // Lógica de filtrado en tiempo real con computed (reciclada del vendedor)
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();
    const allProducts = this.products();

    return allProducts.filter(product => {
      const productName = product.name || product.nombre || '';
      const productCategory = product.category || product.categoria || '';

      const matchesSearch = product.name.toLowerCase().includes(query);
      const matchesCategory = category === 'Todos' || product.category === category;

      return matchesSearch && matchesCategory;
    });
  });

  seleccionarCategoria(category: string) {
    this.selectedCategory.set(category);
  }

  /*cargarCatalogo() {
    this.inventoryService.getPublicProducts().subscribe({
      next: (data) => {
        this.products.set(data);
      },
      error: (err) => {
        console.error('Error al cargar el catálogo:', err);
      }
    });
  }*/

  agregarAlCarrito(product: any) {
    this.cartService.addToCart(product);
    alert(`¡${product.name} agregado al carrito!`);
  }
}