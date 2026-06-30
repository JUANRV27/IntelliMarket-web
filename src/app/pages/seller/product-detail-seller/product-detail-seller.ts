import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service'; // 💡 Tu servicio real conectado a Spring Boot
import { ProductsRequest } from '../../../models/products-request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-product-detail-seller',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './product-detail-seller.html', // Aseguramos que apunte a tu plantilla
  styleUrl: './product-detail-seller.css'
})
export class ProductDetailSeller implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  private inventoryService = inject(InventoryService);
  private toastService = inject(ToastService);

  productId = signal<string | null>(null);
  storeId = signal<string>('');
  isEditing = signal(false);

  // 💡 Datos reales del Producto desde la Base de Datos
  product = signal<any>(null);
  relatedProducts = signal<any[]>([]); // Inicialmente vacío o mapeado dinámicamente

  // Edit fields reactivos
  editName = signal('');
  editPrice = signal(0);
  editDescription = signal('');

  ngOnInit(): void {
    // Recuperamos la tienda del LocalStorage para mantener consistencia
    const savedStoreId = localStorage.getItem('intellimarket.storeId');
    if (savedStoreId) {
      this.storeId.set(savedStoreId);
    }

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.productId.set(id);
      if (id) {
        this.loadProductFromBackend(id);
      }
    });
  }

  // 💡 Carga la información real consumiendo la API Rest
  loadProductFromBackend(id: string): void {
    console.log(`[DETAIL] Recuperando producto real ID: ${id} para tienda: ${this.storeId()}`);
    this.inventoryService.getProductByIdAndStore(id, this.storeId()).subscribe({
      next: (prod) => {
        // Normalizamos los campos en caso vengan como unitPrice o price desde Spring Boot
        const normalizedProd = {
          ...prod,
          price: prod.unitPrice || prod.price || 0,
          image: prod.imageUrl || 'https://via.placeholder.com/464',
          isVisible: prod.stock > 0 // O la propiedad boolean real que uses
        };
        
        this.product.set(normalizedProd);
        this.loadProductFields();
        this.loadRelatedProductsMock(); // Carga alternativas limpias
      },
      error: (err) => console.error('Error al recuperar detalle del backend:', err)
    });
  }

  loadProductFields(): void {
    const prod = this.product();
    if (prod) {
      this.editName.set(prod.name);
      this.editPrice.set(prod.price);
      this.editDescription.set(prod.description);
    }
  }

  // 💡 Mapea dinámicamente otros productos como relacionados
  loadRelatedProductsMock(): void {
    this.inventoryService.getStockByStore(this.storeId()).subscribe(data => {
      const currentId = this.productId();
      const list = data
        .filter((p: any) => p.id !== currentId)
        .slice(0, 4)
        .map((p: any) => ({
          ...p,
          price: p.unitPrice || p.price,
          image: p.imageUrl || 'https://via.placeholder.com/150',
          tag: p.category || 'Destacado'
        }));
      this.relatedProducts.set(list);
    });
  }

  toggleVisibility(): void {
    const prod = this.product();
    if (prod) {
      // Invertimos la visibilidad localmente para dar feedback inmediato al switch de Figma
      this.product.update(p => ({ ...p, isVisible: !p.isVisible }));
      console.log('[DETAIL] Modificando disponibilidad visual del producto...');
    }
  }

  toggleEditMode(): void {
    if (this.isEditing()) {
      // === MODO GUARDAR CAMBIOS REALES ===
      const id = this.productId();
      if (id && this.storeId()) {
        const payload: ProductsRequest = {
          name: this.editName(),
          category: this.product().category,
          description: this.editDescription(),
          unitPrice: this.editPrice(),
          stock: this.product().stock || 10,
          imageUrl: this.product().image
        };

        console.log(`[DETAIL] Persistiendo cambios en BD para producto: ${id}`, payload);
        
        this.inventoryService.updateProduct(id, this.storeId(), payload).subscribe({
          next: () => {
            this.toastService.success('¡Especificaciones del producto actualizadas con éxito!');
            this.isEditing.set(false);
            this.loadProductFromBackend(id); // Recargamos de la BD
          },
          error: (err) => this.toastService.error('Error al actualizar: ' + (err.error?.message || err.message))
        });
      }
    } else {
      this.loadProductFields();
      this.isEditing.set(true);
    }
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.loadProductFields();
  }

  checkStockAlert(): void {
    const prod = this.product();
    if (prod) {
      this.toastService.success(`Inventario actual: Quedan ${prod.stock || 0} unidades físicas en almacén.`);
    }
  }
}