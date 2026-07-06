import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../services/token.service';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: 'edit.html',
  styleUrl: 'edit.css'
})
export class ProfileEdit implements OnInit {
  private tokenService   = inject(TokenService);
  private profileService = inject(ProfileService);
  private router         = inject(Router);
  private toastService   = inject(ToastService);

  userRole = this.tokenService.role;

  phone   = '';
  address = '';
  dni     = '';

  // Controlan cuándo mostrar errores
  phoneTouched   = false;
  dniTouched     = false;
  addressTouched = false;

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
        this.phone   = data.phone   || '';
        this.address = data.address || '';
        this.dni     = data.dni     || '';
      },
      error: () => console.warn('Perfil vacio o error de acceso.')
    });
  }

  // ── Validaciones ──────────────────────────────────────────────────
  isPhoneValid(): boolean {
    return /^\d{9}$/.test(this.phone);
  }

  isDniValid(): boolean {
    // Opcional; si tiene algo, exactamente 8 dígitos
    return this.dni.trim() === '' || /^\d{8}$/.test(this.dni);
  }

  isAddressValid(): boolean {
    // Opcional; si tiene algo, al menos 5 caracteres
    return this.address.trim() === '' || this.address.trim().length >= 5;
  }

  isFormValid(): boolean {
    const esVendedor = this.userRole === 'SELLER' || this.userRole === 'ROLE_SELLER';
    return esVendedor
      ? this.isPhoneValid() && this.isDniValid()
      : this.isPhoneValid() && this.isAddressValid();
  }

  onGuardar() {
    this.phoneTouched   = true;
    this.dniTouched     = true;
    this.addressTouched = true;

    if (!this.isFormValid()) return;

    const esVendedor = this.userRole === 'SELLER' || this.userRole === 'ROLE_SELLER';

    const updateRequest = esVendedor
      ? this.profileService.updateOwnerProfile({
          phone: this.phone.trim(),
          dni:   this.dni.trim() || undefined
        })
      : this.profileService.updateCustomerProfile({
          phone:   this.phone.trim(),
          address: this.address.trim() || undefined
        });

    updateRequest.subscribe({
      next: () => {
        this.toastService.success('Perfil actualizado correctamente.');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.toastService.error('Hubo un error al guardar: ' + (err.error?.message || 'Error interno'));
      }
    });
  }
}