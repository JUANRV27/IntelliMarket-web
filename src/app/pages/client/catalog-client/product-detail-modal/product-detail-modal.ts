import { Component, inject, signal, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { InventoryService } from '../../../services/inventory.service';
import { InventoryService } from '../../../../services/inventory.service';
import { CartService } from '../../../../services/cart.service';
import { Review } from '../../../../models/review.model';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail-modal.html',
  styleUrl: './product-detail-modal.css'
})
export class ProductDetailModal implements OnInit {
  private inventoryService = inject(InventoryService);
  private cartService = inject(CartService);

  @Input() product: any;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  reviews = signal<Review[]>([]);
  loadingReviews = signal(false);
  
  // Para crear nueva reseña
  showReviewForm = signal(false);
  reviewAuthor = signal('');
  reviewRating = signal(5);
  reviewComment = signal('');
  isSubmittingReview = signal(false);

  ngOnInit() {
    if (this.product?.id) {
      this.cargarResenas();
    }
  }

  cargarResenas() {
    this.loadingReviews.set(true);
    this.inventoryService.getProductReviews(this.product.id).subscribe({
      next: (data) => {
        this.reviews.set(data);
        this.loadingReviews.set(false);
      },
      error: (err) => {
        console.warn('Error al cargar reseñas', err);
        this.reviews.set([]);
        this.loadingReviews.set(false);
      }
    });
  }

  close() {
    this.closeModal.emit();
  }

  agregarAlCarrito() {
    this.cartService.addToCart(this.product);
    alert(`¡${this.product.name} agregado al carrito!`);
  }

  toggleReviewForm() {
    this.showReviewForm.set(!this.showReviewForm());
  }

  enviarResena() {
    if (!this.reviewAuthor().trim() || !this.reviewComment().trim()) {
      alert('Por favor completa todos los campos de la reseña');
      return;
    }

    this.isSubmittingReview.set(true);
    
    const newReview = {
      productId: this.product.id,
      rating: this.reviewRating(),
      comment: this.reviewComment(),
      author: this.reviewAuthor()
    };

    this.inventoryService.createProductReview(newReview).subscribe({
      next: (review) => {
        // Agregar la reseña al listado
        this.reviews.update(reviews => [...reviews, review]);
        
        // Limpiar formulario
        this.reviewAuthor.set('');
        this.reviewComment.set('');
        this.reviewRating.set(5);
        this.showReviewForm.set(false);
        this.isSubmittingReview.set(false);
        
        alert('¡Reseña enviada exitosamente!');
      },
      error: (err) => {
        console.error('Error al enviar reseña:', err);
        this.isSubmittingReview.set(false);
        alert('Error al enviar la reseña. Intenta de nuevo.');
      }
    });
  }

  renderStars(rating: number): string {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}

