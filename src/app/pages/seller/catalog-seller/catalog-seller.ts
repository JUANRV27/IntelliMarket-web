import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service'; // 💡 Inyectamos tu servicio real
import { ProductsRequest } from '../../../models/products-request';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../models/category-products';
import { DecimalPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog-seller',
  standalone: true, // Aseguramos standalone si aplica
  imports: [FormsModule, DecimalPipe, CommonModule],
  templateUrl: './catalog-seller.html',
  styleUrl: './catalog-seller.css'
})
export class CatalogSeller implements OnInit {
  private inventoryService = inject(InventoryService); // 💡 Conexión al backend

  // Estado reactivo real de productos traídos de Spring Boot
  productsInStock = signal<any[]>([]);
  storeId = signal<string>('');

  // Filter signals
  searchQuery = signal('');
  selectedCategory = signal('Todos');
  showAddModal = signal(false);

  // Form signals para el Modal integrado
  newProdName = signal('');
  newProdPrice = signal<number | null>(null);
  newProdDescription = signal('');
  newProdStock = signal<number>(10); // Campo necesario para la US-05
  newProdCategory = signal<Category>(Category.ELECTRONICA);

  private router = inject(Router);
  // 💡 Mapeamos los valores del Enum dinámicamente para que tu HTML los renderice sin cambios
  public categories = Object.values(Category);

  ngOnInit(): void {
    // Recuperamos el ID real que salvamos en el Login
    const savedStoreId = localStorage.getItem('intellimarket.storeId');
    // 💡 SOLUCIÓN AL ERROR TS2345: Solo hacemos el set si hay un string
    if (savedStoreId !== null) {
      this.storeId.set(savedStoreId);
      this.loadRealCatalog();
    } else {
      console.error('No se encontró storeId en LocalStorage. Redirigiendo...');
      this.router.navigate(['/auth/login']); // O a la vista de creación de tienda
    }
  }

  // 💡 MODO REAL: Trae los productos directo del Stock de la base de datos
  loadRealCatalog(): void {
    console.log('[CATALOG] Cargando stock real desde backend para tienda:', this.storeId());
    this.inventoryService.getStockByStore(this.storeId()).subscribe({
      next: (data) => {
        console.log('[CATALOG] Productos recuperados con éxito:', data);
        this.productsInStock.set(data);
      },
      error: (err) => console.error('Error al mapear catálogo desde Spring Boot:', err)
    });
  }

  // Computed properties filtrando sobre la respuesta real del backend
  filteredProducts = computed(() => {
    let list = this.productsInStock();

    // 1. Filtro por caja de texto
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    // 2. Filtro por categoría real mapeada de tu base de datos
    const category = this.selectedCategory();
    if (category !== 'Todos') {
      list = list.filter(p => p.category === category);
    }

    return list;
  });

  get totalProductsCount(): number {
    return this.productsInStock().length;
  }

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  openModal(): void {
    this.showAddModal.set(true);
  }

  isEditing = signal<boolean>(false);
  editingProductId = signal<string | null>(null);
  openEditModal(product: any): void {
    this.isEditing.set(true);
    this.editingProductId.set(product.id);
    
    // Poblamos las señales del formulario con los valores actuales del producto
    this.newProdName.set(product.name);
    this.newProdPrice.set(product.unitPrice);
    this.newProdDescription.set(product.description);
    this.newProdStock.set(product.stock);
    this.newProdCategory.set(product.category);
    
    // Abrimos el modal
    this.showAddModal.set(true);
  }

  // 3. Modifica tu método closeModal para limpiar los estados de edición
  closeModal(): void {
    this.showAddModal.set(false);
    this.isEditing.set(false);
    this.editingProductId.set(null);
    this.resetForm();
  }

  // 💡 CONEXIÓN REAL: Registrar producto desde el modal directo a la BD (US-05)
  submitProduct(): void {
    if (!this.newProdName().trim() || !this.newProdPrice() || !this.newProdDescription().trim()) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const payload: ProductsRequest = {
      name: this.newProdName(),
      category: this.newProdCategory(),
      description: this.newProdDescription(),
      unitPrice: this.newProdPrice() || 0,
      stock: this.newProdStock(),
      imageUrl: 'https://via.placeholder.com/150' // Puedes agregar un campo para URL de imagen si quieres
    };

    if (this.isEditing()) {
      // === MODO EDICIÓN ===
      console.log(`[CATALOG] Actualizando producto ${this.editingProductId()} para tienda ${this.storeId()}...`, payload);
      
      // Aquí invocas el método PUT de tu servicio de inventario
      this.inventoryService.updateProduct(this.editingProductId()!, this.storeId(), payload).subscribe({
        next: (res) => {
          alert('¡Producto actualizado con éxito!');
          this.closeModal();
          this.loadRealCatalog();
        },
        error: (err) => alert('Error al actualizar: ' + (err.error?.message || err.message))
      });

    } else {
      // === MODO CREACIÓN (Tu código original intacto) ===
      console.log('[CATALOG] Registrando nuevo producto...', payload);
      this.inventoryService.createProduct(this.storeId(), payload).subscribe({
        next: (res) => {
          alert('¡Producto añadido al catálogo!');
          this.closeModal();
          this.loadRealCatalog();
        },
        error: (err) => alert('Error al guardar: ' + (err.error?.message || err.message))
      });
    }
  }

  goToStockView(): void {
    console.log('[CATALOG] Navegando a la lista de stock real de la tienda...');
    this.router.navigate(['/seller/stock']);
  }

  resetForm(): void {
    this.newProdName.set('');
    this.newProdPrice.set(null);
    this.newProdDescription.set('');
    this.newProdStock.set(10);
    this.newProdCategory.set(Category.ELECTRONICA);
  }

  goToSettingsView(): void {
    console.log('[CATALOG] Redirigiendo a la vista de configuración de la tienda...');
    this.router.navigate(['/seller/settings']);
  }

  goToProfile(): void {
    console.log('[CATALOG] Navegando al perfil del vendedor...');
    this.router.navigate(['/seller/profile']);
  }

  deleteProduct(id: string, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (confirm('¿Está seguro de eliminar este producto de su catálogo real?')) {
      // Si tienes un método delete en tu service lo puedes enganchar aquí,
      // por ahora removemos local si no hay endpoint DELETE implementado.
      this.productsInStock.update(prods => prods.filter(p => p.id !== id));
    }
  }

  viewDetails(id: string): void {
    console.log(`[CATALOG] Navegando al detalle del producto: ${id}`);
    // Asegúrate de que esta ruta coincida con la que pusiste en app.routes.ts
    this.router.navigate(['/seller/product', id]);
  }
}