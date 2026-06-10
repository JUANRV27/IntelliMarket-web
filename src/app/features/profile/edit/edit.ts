import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Usamos formularios para capturar los inputs
import { TokenService } from '../../../core/services/token.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-profile-edit',
  imports: [RouterLink, FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class ProfileEdit implements OnInit {
  private tokenService = inject(TokenService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  userRole = this.tokenService.role;
  
  // Variables ligadas al formulario con [(ngModel)]
  phone: string = '';
  address: string = '';
  dni: string = '';

  ngOnInit() {
    this.precargarDatos();
  }

  precargarDatos() {
    // Intenta leer el perfil actual para rellenar los inputs automáticamente
    const obs = this.userRole === 'SELLER' ? this.profileService.getOwnerProfile() : this.profileService.getCustomerProfile();
    obs.subscribe({
      next: (data) => {
        this.phone = data.phone || '';
        this.address = data.address || '';
        this.dni = data.dni || '';
      },
      error: () => {
        // Fallback simulación por si no hay conexión
        this.phone = '987654321';
        if (this.userRole === 'SELLER') this.dni = '88888888';
        else this.address = 'Av. El Corregidor 123, La Molina';
      }
    });
  }

  onGuardar() {
    if (this.userRole === 'SELLER') {
      this.profileService.updateOwnerProfile({ phone: this.phone, dni: this.dni }).subscribe({
        next: () => this.router.navigate(['/profile']),
        error: () => this.router.navigate(['/profile']) // Salva el flujo si es simulacro
      });
    } else {
      this.profileService.updateCustomerProfile({ phone: this.phone, address: this.address }).subscribe({
        next: () => this.router.navigate(['/profile']),
        error: () => this.router.navigate(['/profile'])
      });
    }
  }
}