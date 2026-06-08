import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketStateService, Product } from '../../../services/market-state';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  stateService = inject(MarketStateService);

  // Filter visible products for display on landing page
  get featuredProducts(): Product[] {
    return this.stateService.products().filter(p => p.isVisible);
  }

  get clientReviews() {
    return this.stateService.reviews();
  }

  scrollToProducts(element: HTMLElement): void {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
