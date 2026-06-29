import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { ProfileService } from '../../../services/profile.service';
import { InventoryService } from '../../../services/inventory.service';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private router         = inject(Router);
  private authService    = inject(AuthService);
  private tokenService   = inject(TokenService);

  private profileService = inject(ProfileService);
  private cdr            = inject(ChangeDetectorRef);
  private inventoryService = inject(InventoryService);
  private storeService   = inject(StoreService);

  email        = '';
  password     = '';
  errorMessage = '';

  ocultarError() {
    if (this.errorMessage) this.errorMessage = '';
  }

  onLogin() {
    this.errorMessage = '';

    this.authService.login({
      email:    this.email.trim(),
      password: this.password.trim()
    }).subscribe({
      next: (response) => {
        const role = response.role;

        if (role === 'SELLER') {
          this.storeService.getMyStore().subscribe({
            next: (store) => {
              // ✅ Guardar ID y NOMBRE de la tienda
              localStorage.setItem('intellimarket.storeId',   store.id.toString());
              localStorage.setItem('intellimarket.storeName', store.name);
              this.router.navigate(['/seller/catalog']);
            },
            error: () => {
              this.router.navigate(['/seller/store/create']);
            }
          });
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Correo o contraseña incorrectos.';
      }
    });
  }

  // Limpia todo el contexto para iniciar desde cero
  cancelarLogin() {
    this.errorMessage = '';
    this.email = '';
    this.password = '';
  }
}