import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { MarketStateService } from '../../../services/market-state';
import { CartService } from '../../../services/cart.service';
import { ProductDetailModal } from '../catalog-client/product-detail-modal/product-detail-modal';
// Importar Category de category-products.ts de models
import { Category } from '../../../models/category-products';
@Component({
  selector: 'app-catalog-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductDetailModal],
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

  // Estado del modal
  selectedProduct = signal<any>(null);
  isModalOpen = signal(false);

  public categories = Object.values(Category);

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading.set(true);

    // Cargamos productos de TODAS las tiendas
    this.inventoryService.getAllProductsFromAllStores().subscribe({
      next: (data: any[]) => {
        // Si el backend responde con éxito, usamos sus productos reales
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.warn('Backend offline o sin tiendas. Usando productos locales por defecto.', err);
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
      // Normalizamos accesos por compatibilidad backend/local
      const productName = product.name || product.nombre || '';
      const productCategory = product.category || product.categoria || '';

      // 1. Validar coincidencia de texto
      const matchesSearch = productName.toLowerCase().includes(query);

      // 2. Validar coincidencia de categoría comercial ('Todos' ignora este filtro)
      const matchesCategory = category === 'Todos' || productCategory === category;

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

  abrirDetalleProducto(product: any) {
    this.selectedProduct.set(product);
    this.isModalOpen.set(true);
  }

  cerrarModal() {
    this.isModalOpen.set(false);
    this.selectedProduct.set(null);
  }
}