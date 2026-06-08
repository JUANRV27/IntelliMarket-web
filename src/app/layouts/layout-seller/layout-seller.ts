import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MarketStateService } from '../../services/market-state';

@Component({
  selector: 'app-layout-seller',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout-seller.html',
  styleUrl: './layout-seller.css'
})
export class LayoutSeller {
  router = inject(Router);
  stateService = inject(MarketStateService);

  logout(): void {
    this.stateService.logoutAsSeller();
    this.router.navigate(['/seller/login']);
  }
}
