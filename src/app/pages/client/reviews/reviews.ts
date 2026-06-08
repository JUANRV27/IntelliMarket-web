import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketStateService } from '../../../services/market-state';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reviews',
  imports: [RouterLink, FormsModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class Reviews {
  stateService = inject(MarketStateService);

  // Form signals
  authorName = signal('');
  commentText = signal('');
  starRating = signal(5);
  showForm = signal(false);

  get reviewsList() {
    return this.stateService.reviews();
  }

  toggleForm(): void {
    this.showForm.update(val => !val);
  }

  submitReview(): void {
    if (!this.authorName().trim() || !this.commentText().trim()) {
      alert('Por favor complete todos los campos');
      return;
    }

    this.stateService.addReview(
      this.authorName(),
      this.starRating(),
      this.commentText()
    );

    // Reset form
    this.authorName.set('');
    this.commentText.set('');
    this.starRating.set(5);
    this.showForm.set(false);
  }

  selectStars(rating: number): void {
    this.starRating.set(rating);
  }
}
