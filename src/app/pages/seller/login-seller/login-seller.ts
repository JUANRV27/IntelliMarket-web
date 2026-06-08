import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MarketStateService } from '../../../services/market-state';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-seller',
  imports: [RouterLink, FormsModule],
  templateUrl: './login-seller.html',
  styleUrl: './login-seller.css'
})
export class LoginSeller {
  router = inject(Router);
  stateService = inject(MarketStateService);

  email = signal('');
  password = signal('');

  login(): void {
    if (!this.email().trim()) {
      alert('Por favor ingrese su correo electrónico');
      return;
    }
    
    // Perform mock login
    this.stateService.loginAsSeller();
    
    // Navigate to seller catalog
    this.router.navigate(['/seller/catalog']);
  }

  register(): void {
    // Perform mock register (same as login in mock state)
    this.stateService.loginAsSeller();
    this.router.navigate(['/seller/catalog']);
  }
}
