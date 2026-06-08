import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketStateService, Product } from '../../../services/market-state';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-catalog-seller',
  imports: [RouterLink, FormsModule, DecimalPipe],
  templateUrl: './catalog-seller.html',
  styleUrl: './catalog-seller.css'
})
export class CatalogSeller {
  stateService = inject(MarketStateService);

  // Filter signals
  searchQuery = signal('');
  selectedCategory = signal('Todos');
  showAddModal = signal(false);

  // Form signals
  newProdName = signal('');
  newProdPrice = signal<number | null>(null);
  newProdDescription = signal('');
  newProdTag = signal('Nuevo');
  newProdCategory = signal('Bebidas');

  // Computed properties
  filteredProducts = computed(() => {
    let list = this.stateService.products();

    // 1. Search Query filter
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    // 2. Category Filter
    const category = this.selectedCategory();
    if (category !== 'Todos') {
      list = list.filter(p => {
        const nameLower = p.name.toLowerCase();
        if (category === 'Bebidas') {
          return nameLower.includes('kola') || nameLower.includes('agua') || nameLower.includes('cusqueña') || nameLower.includes('fanta') || nameLower.includes('sprite') || nameLower.includes('pepsi') || nameLower.includes('coca');
        } else if (category === 'Lácteos') {
          return nameLower.includes('gloria') || nameLower.includes('leche');
        } else if (category === 'Abarrotes') {
          return nameLower.includes('elite') || nameLower.includes('cuates') || nameLower.includes('tortillas');
        }
        return true;
      });
    }

    return list;
  });

  get totalProductsCount(): number {
    return this.stateService.products().length;
  }

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  openModal(): void {
    this.showAddModal.set(true);
  }

  closeModal(): void {
    this.showAddModal.set(false);
    this.resetForm();
  }

  submitProduct(): void {
    if (!this.newProdName().trim() || !this.newProdPrice() || !this.newProdDescription().trim()) {
      alert('Por favor complete todos los campos');
      return;
    }

    // Set default placeholder image based on category if empty
    const imgUrl = 'http://localhost:3845/assets/53d13b256d0eb1f1e4fae1093b2999252fb2cfae.png';

    this.stateService.addProduct({
      name: this.newProdName(),
      price: this.newProdPrice() || 0,
      description: this.newProdDescription(),
      tag: this.newProdTag(),
      image: imgUrl,
      isVisible: true
    });

    this.closeModal();
  }

  resetForm(): void {
    this.newProdName.set('');
    this.newProdPrice.set(null);
    this.newProdDescription.set('');
    this.newProdTag.set('Nuevo');
    this.newProdCategory.set('Bebidas');
  }

  deleteProduct(id: string, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (confirm('¿Está seguro de eliminar este producto de su catálogo?')) {
      this.stateService.products.update(prods => prods.filter(p => p.id !== id));
    }
  }
}
