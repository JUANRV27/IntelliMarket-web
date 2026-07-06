import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';
import { TokenService } from '../../../services/token.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-profile-customer',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './profile-customer.html',
  styleUrl: './profile-customer.css'
})
export class ProfileCustomer implements OnInit {
  private profileService = inject(ProfileService);
  private tokenService   = inject(TokenService);
  private router         = inject(Router);
  private toastService   = inject(ToastService);

  isLoading    = signal(true);
  errorMessage = signal('');
  isFirstTime  = signal(false);
  isEditing    = signal(false);

  profileData  = signal<any>(null);

  editPhone   = '';
  editAddress = '';

  ngOnInit(): void {
    if (!this.tokenService.token) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.profileService.getCustomerProfile().subscribe({
      next: (data) => {
        this.profileData.set(data);
        this.isLoading.set(false);

        // Si phone está vacío → primera vez
        if (!data.phone) {
          this.isFirstTime.set(true);
          this.editPhone   = '';
          this.editAddress = '';
        }
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el perfil. Intente de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  completeProfile(): void {
    if (!this.editPhone.trim()) {
      alert('El número de teléfono es obligatorio.');
      return;
    }
    this.saveToBackend();
  }

  isPhoneValid(): boolean {
    const phoneRegex = /^\d{9}$/;
    return phoneRegex.test(this.editPhone);
  }

  startEditing(): void {
    this.editPhone   = this.profileData()?.phone   || '';
    this.editAddress = this.profileData()?.address || '';
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
  }

  saveProfile(): void {
    if (!this.editPhone.trim()) {
      alert('El número de teléfono es obligatorio.');
      return;
    }
    this.saveToBackend();
  }

  private saveToBackend(): void {
    this.profileService.updateCustomerProfile({
      phone:   this.editPhone,
      address: this.editAddress
    }).subscribe({
      next: (updated) => {
        this.profileData.set(updated);
        this.isFirstTime.set(false);
        this.isEditing.set(false);
        this.toastService.success('¡Perfil guardado con éxito!');
      },
      error: (err) => {
        this.toastService.error('Error al guardar: ' + (err.error?.message || 'Error interno'));
      }
    });
  }
}