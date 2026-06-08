import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MarketStateService } from '../../services/market-state';

@Component({
  selector: 'app-layout-client',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout-client.html',
  styleUrl: './layout-client.css'
})
export class LayoutClient {
  router = inject(Router);
  stateService = inject(MarketStateService);

  onSearch(event: any): void {
    // For mock search, we can just log or trigger something
    console.log('Search query:', event.target.value);
  }
}
