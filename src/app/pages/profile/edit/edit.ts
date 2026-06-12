import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../services/token.service';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: 'edit.html',
  styleUrl: 'edit.css'
})
export class ProfileEdit implements OnInit {
  private tokenService = inject(TokenService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  userRole = this.tokenService.role;
  
  phone: string = '';
  address: string = '';
  dni: string = '';

  ngOnInit() {
    this.precargarDatosReales();
  }

  precargarDatosReales() {
    const esVendedor = this.userRole === 'SELLER' || this.userRole === 'ROLE_SELLER';

    const request = esVendedor 
      ? this.profileService.getOwnerProfile() 
      : this.profileService.getCustomerProfile();

    request.subscribe({
      next: (data) => {
        this.phone = data.phone || '';
        this.address = data.address || '';
        this.dni = data.dni || '';
      },
      error: (err) => {
        console.warn('Perfil vacío o error de acceso, cargando formulario en blanco.');
        // No hacemos nada más, los inputs de Angular simplemente empezarán vacíos
      }
    });
  }

  onGuardar() {
    const esVendedor = this.userRole === 'SELLER' || this.userRole === 'ROLE_SELLER';

    const updateRequest = esVendedor
      ? this.profileService.updateOwnerProfile({ phone: this.phone, dni: this.dni })
      : this.profileService.updateCustomerProfile({ phone: this.phone, address: this.address });

    updateRequest.subscribe({
      next: () => {
        console.log('Perfil actualizado en la Base de Datos');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Error guardando en el backend', err);
        alert('Hubo un error al guardar. Revisa la consola.');
      }
    });
  }
}