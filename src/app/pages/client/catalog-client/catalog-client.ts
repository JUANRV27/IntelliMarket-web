import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { CartService } from '../../../services/cart.service';
import { ProductDetailModal } from '../catalog-client/product-detail-modal/product-detail-modal';
import { Category } from '../../../models/category-products';
import { ProductsResponse } from '../../../models/products-response';

@Component({
  selector: 'app-catalog-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductDetailModal],
  templateUrl: './catalog-client.html',
  styleUrl: './catalog-client.css'
})
export class CatalogClient implements OnInit {
  private inventoryService = inject(InventoryService);
  private cartService = inject(CartService);

  searchQuery = signal('');
  selectedCategory = signal('Todos');

  // Filtrador por tienda / store
  selectedStore = signal('Todos');

  products = signal<ProductsResponse[]>([]);
  loading = signal(true);

  storeNamesMap = signal<Record<string, string>>({});

  selectedProduct = signal<ProductsResponse | null>(null);
  isModalOpen = signal(false);

  public categories = Object.values(Category);

  ngOnInit() {
    // Ahora cargamos primero los nombres de tienda, y luego los productos.
    this.cargarTiendasYProductos();
    this.inicializarCarrito();
  }

  cargarTiendasYProductos() {
    this.loading.set(true);

    // 1. Primero traemos las tiendas reales
    this.inventoryService.getStoresByOwner().subscribe({
      next: (stores: any[]) => {
        const cache: Record<string, string> = {};
        stores.forEach(s => {
          cache[String(s.id)] = s.name; // Guardamos el ID con su nombre comercial real
        });
        this.storeNamesMap.set(cache);

        // 2. Una vez que tenemos los nombres, cargamos los productos aplanados
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error al precargar nombres de tiendas:', err);
        // Fallback por si acaso falla: cargamos los productos igual
        this.cargarProductos();
      }
    });
  }

  cargarProductos() {
    this.loading.set(true);

    this.inventoryService.getAllProductsFromAllStores().subscribe({
      next: (data: ProductsResponse[]) => {
        console.log('📡 DATOS DEL BACKEND (con storeId real):', data);
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el inventario global:', err);
        this.loading.set(false);
      }
    });
  }

  inicializarCarrito() {
    this.cartService.loadCartFromBackend().subscribe();
  }

  // Lista de tiendas para el dropdown
  storesList = computed(() => {
    const idsUnicos = new Set<string>();

    this.products().forEach(prod => {
      const storeId = String((prod as any).storeId || (prod as any).store?.id);
      if (storeId && storeId !== 'undefined') {
        idsUnicos.add(storeId);
      }
    });

    return Array.from(idsUnicos).map(id => {
      return {
        id: id,
        // Ahora storeNamesMap() sí tiene datos reales del backend
        name: this.storeNamesMap()[id] || `Tienda ${id}`
      };
    });
  });

  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();
    const storeFilter = this.selectedStore();

    return this.products().filter(prod => {
      if (!prod) return false;
      const storeId = String((prod as any).storeId || (prod as any).store?.id);

      const matchesSearch = prod.name?.toLowerCase().includes(query) || false;
      const matchesCategory = category === 'Todos' || prod.category === category;
      const matchStore = storeFilter === 'Todos' || storeId === storeFilter;
      return matchesSearch && matchesCategory && matchStore;
    });
  });

  seleccionarCategoria(category: string) {
    this.selectedCategory.set(category);
  }

  agregarAlCarrito(prod: ProductsResponse) {
    const productId = prod.id;
    const storeId = (prod as any).storeId || (prod as any).store?.id;

    if (!storeId) {
      console.error('🔴 El producto no tiene storeId. Verifica que el backend lo esté mandando:', prod);
      alert('No se pudo determinar la tienda de este producto. Intenta recargar la página.');
      return;
    }

    console.log(`📦 Enviando al carrito -> productId: ${productId}, storeId: ${storeId}`);

    this.cartService.addToCartBackend(productId, storeId, 1).subscribe({
      next: () => alert(`¡${prod.name} agregado al carrito con éxito!`),
      error: (err) => {
        console.error('🔴 Error en el backend:', err.error);
        alert(`Error: ${err.error?.message || 'No disponible en esta tienda'}`);
      }
    });
  }

  abrirDetalleProducto(prod: ProductsResponse) {
    this.selectedProduct.set(prod);
    this.isModalOpen.set(true);
  }

  cerrarModal() {
    this.isModalOpen.set(false);
    this.selectedProduct.set(null);
  }
}