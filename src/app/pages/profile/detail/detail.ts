import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { ProfileService } from '../../../services/profile.service';
import { ProfileResponse } from '../../../models/profile.model';

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: 'detail.html',
  styleUrl: 'detail.css'
})
export class ProfileDetail implements OnInit {
  private tokenService = inject(TokenService);
  private profileService = inject(ProfileService);

  profile = signal<ProfileResponse | null>(null);
  userRole = this.tokenService.role;
  loading = true;

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    const esVendedor = this.userRole === 'SELLER' || this.userRole === 'ROLE_SELLER';

    const request = esVendedor 
      ? this.profileService.getOwnerProfile() 
      : this.profileService.getCustomerProfile();

    request.subscribe({
      next: (data) => {
        this.profile.set(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error del backend:', err);
        
        // ESCUDO PROTECTOR: Si el backend tira 500, asumimos que el perfil está vacío
        if (err.status === 500 || err.status === 403) {
           this.profile.set({
             phone: 'No registrado',
             address: 'No registrada',
             dni: 'No registrado'
           } as ProfileResponse);
        }
        this.loading = false;
      }
    });
  }
}