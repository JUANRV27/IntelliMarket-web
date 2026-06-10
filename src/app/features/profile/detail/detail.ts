import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TokenService } from '../../../core/services/token.service';
import { ProfileService } from '../../../core/services/profile.service';
import { ProfileResponse } from '../../../shared/models/profile.model';

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class ProfileDetail implements OnInit {
  private tokenService = inject(TokenService);
  private profileService = inject(ProfileService);

  // Señal para almacenar los datos del perfil devueltos por la API
  profile = signal<ProfileResponse | null>(null);
  userRole = this.tokenService.role;

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    // Verificamos el rol para saber a qué endpoint llamar
    if (this.userRole === 'SELLER') {
      this.profileService.getOwnerProfile().subscribe({
        next: (data) => this.profile.set(data),
        error: () => this.cargarPerfilMock() // Datos de prueba si el backend está apagado
      });
    } else {
      this.profileService.getCustomerProfile().subscribe({
        next: (data) => this.profile.set(data),
        error: () => this.cargarPerfilMock()
      });
    }
  }

  private cargarPerfilMock() {
    // Simulacro clásico para que puedas ver el diseño sin el backend corriendo
    if (this.userRole === 'SELLER') {
      this.profile.set({
        userId: 1,
        firstName: 'Carlos',
        lastName: 'Mendoza',
        email: 'tienda@intellimarket.com',
        phone: '987654321',
        dni: '88888888'
      });
    } else {
      this.profile.set({
        userId: 2,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@gmail.com',
        phone: '912345678',
        address: 'Av. El Corregidor 123, La Molina'
      });
    }
  }
}