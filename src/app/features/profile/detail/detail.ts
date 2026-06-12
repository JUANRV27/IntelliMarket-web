import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../core/services/token.service';
import { ProfileService } from '../../../core/services/profile.service';
import { ProfileResponse } from '../../../shared/models/profile.model';

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class ProfileDetail implements OnInit {
  private tokenService = inject(TokenService);
  private profileService = inject(ProfileService);

  // Señal para almacenar los datos del perfil devueltos por la API
  profile = signal<ProfileResponse | null>(null);
  // Señal para capturar mensajes de error si el backend falla
  errorMessage = signal<string | null>(null);

  userRole = this.tokenService.role();

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    // Nos aseguramos de leer el rol actualizado en el momento de la carga
    this.userRole = this.tokenService.role();

    if (!this.userRole) {
      this.errorMessage.set('No se encontró una sesión activa.');
      return;
    }

    // Verificamos el rol para saber a qué endpoint llamar
    if (this.userRole === 'SELLER') {
      this.profileService.getOwnerProfile().subscribe({
        next: (data) => {
          this.profile.set(data);
          this.errorMessage.set(null);

          // 💡 TRUCO DE INTEGRACIÓN: Aprovechamos que la API nos devuelve el perfil real 
          // para guardar el id de tienda dinámico (ya sea el id del perfil o el que manejes)
          if (data.userId) {
            this.tokenService.storeId.set(data.userId.toString());
            localStorage.setItem('intellimarket.storeId', data.userId.toString());
          }

        },
        error: (err) => {
          console.error('Error al traer perfil de vendedor desde Spring Boot:', err);
          this.errorMessage.set('No se pudieron cargar los datos del perfil desde el servidor.');
        }

      });
    } else {
      this.profileService.getCustomerProfile().subscribe({
        next: (data) => {
          this.profile.set(data);
          this.errorMessage.set(null);
        },
        error: (err) => {
          console.error('Error al traer perfil de cliente desde Spring Boot:', err);
          this.errorMessage.set('No se pudieron cargar los datos de tu cuenta.');
        }
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