import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { ProfileService } from '../../../services/profile.service'; // Asegúrate de tener esta importación

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private router = inject(Router);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService); 
  private profileService = inject(ProfileService); // Inyectamos el servicio de perfiles
  private cdr = inject(ChangeDetectorRef); 

  email = '';
  password = '';
  errorMessage = '';

  ocultarError() {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  onLogin() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response: any) => {
        // 1. Guardamos el token
        this.tokenService.save(response.token, response.email, 'PENDING'); 

        // 2. FORZAR CONSULTA DE PERFIL (La única fuente de verdad real ahora mismo)
        // Usamos el servicio de perfil para ver si existe como 'Owner' o como 'Customer'
        this.profileService.getOwnerProfile().subscribe({
          next: (profile: any) => {
            // Si el servicio de dueño responde, es VENDEDOR
            const role = 'SELLER';
            localStorage.setItem('role', role);
            
            // Lógica de navegación
            const storeId = profile.storeId || (profile.store ? profile.store.id : null);
            if (storeId) {
              localStorage.setItem('intellimarket.storeId', storeId.toString());
              this.router.navigate(['/seller/inventory']);
            } else {
              this.router.navigate(['/seller/store/create']);
            }
          },
          error: () => {
            // Si getOwnerProfile falla (404/403), asumimos que es CLIENTE
            localStorage.setItem('role', 'CUSTOMER');
            this.router.navigate(['/']);
          }
        });
      }
    });
  }
}