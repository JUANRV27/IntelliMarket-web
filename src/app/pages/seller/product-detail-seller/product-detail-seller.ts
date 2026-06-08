import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MarketStateService, Product } from '../../../services/market-state';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail-seller',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './product-detail-seller.html',
  styleUrl: './product-detail-seller.css'
})
export class ProductDetailSeller implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  stateService = inject(MarketStateService);

  productId = signal<string | null>(null);
  isEditing = signal(false);

  // Edit fields
  editName = signal('');
  editPrice = signal(0);
  editDescription = signal('');

  // Fetch target product
  product = computed(() => {
    const id = this.productId();
    if (!id) return null;
    return this.stateService.products().find(p => p.id === id) || null;
  });

  // Related products
  relatedProducts = computed(() => {
    const current = this.product();
    if (!current) return [];
    return this.stateService.products().filter(p => p.id !== current.id).slice(0, 4);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.productId.set(id);
      this.loadProductFields();
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

  toggleVisibility(): void {
    const id = this.productId();
    if (id) {
      this.stateService.toggleProductVisibility(id);
    }
  }

  toggleEditMode(): void {
    if (this.isEditing()) {
      // Save changes
      const id = this.productId();
      if (id) {
        this.stateService.products.update(prods => 
          prods.map(p => p.id === id ? {
            ...p,
            name: this.editName(),
            price: this.editPrice(),
            description: this.editDescription()
          } : p)
        );
      }
      this.isEditing.set(false);
    } else {
      this.loadProductFields();
      this.isEditing.set(true);
    }
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.loadProductFields();
  }
}
