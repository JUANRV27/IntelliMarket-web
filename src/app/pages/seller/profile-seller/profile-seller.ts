import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';
import { TokenService } from '../../../services/token.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-profile-seller',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './profile-seller.html',
  styleUrl: './profile-seller.css'
})
export class ProfileSeller implements OnInit {
  private profileService = inject(ProfileService);
  private tokenService   = inject(TokenService);
  private router         = inject(Router);
  private toastService   = inject(ToastService);

  isLoading    = signal(true);
  errorMessage = signal('');
  isFirstTime  = signal(false);
  isEditing    = signal(false);
  profileData  = signal<any>(null);

  editPhone = '';
  editDni   = '';

  // Controlan cuándo mostrar errores (solo tras interacción del usuario)
  phoneTouched = false;
  dniTouched   = false;

  ngOnInit(): void {
    if (!this.tokenService.token) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.profileService.getOwnerProfile().subscribe({
      next: (data) => {
        this.profileData.set(data);
        this.isLoading.set(false);
        if (!data.phone) {
          this.isFirstTime.set(true);
          this.editPhone = '';
          this.editDni   = '';
        }
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el perfil. Intente de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  // ── Validaciones ──────────────────────────────────────────────────
  isPhoneValid(): boolean {
    return /^\d{9}$/.test(this.editPhone);
  }

  isDniValid(): boolean {
    // DNI es opcional — si está vacío es válido; si tiene algo, deben ser exactamente 8 dígitos
    return this.editDni.trim() === '' || /^\d{8}$/.test(this.editDni);
  }

  isFormValid(): boolean {
    return this.isPhoneValid() && this.isDniValid();
  }

  // ── Acciones ──────────────────────────────────────────────────────
  completeProfile(): void {
    this.phoneTouched = true;
    this.dniTouched   = true;
    if (!this.isFormValid()) return;
    this.saveToBackend();
  }

  startEditing(): void {
    this.editPhone    = this.profileData()?.phone || '';
    this.editDni      = this.profileData()?.dni   || '';
    this.phoneTouched = false;
    this.dniTouched   = false;
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.phoneTouched = false;
    this.dniTouched   = false;
    this.isEditing.set(false);
  }

  saveProfile(): void {
    this.phoneTouched = true;
    this.dniTouched   = true;
    if (!this.isFormValid()) return;
    this.saveToBackend();
  }

  private saveToBackend(): void {
    this.profileService.updateOwnerProfile({
      phone: this.editPhone,
      dni:   this.editDni.trim() || undefined
    }).subscribe({
      next: (updated) => {
        this.profileData.set(updated);
        this.isFirstTime.set(false);
        this.isEditing.set(false);
        this.phoneTouched = false;
        this.dniTouched   = false;
        this.toastService.success('Perfil guardado con exito.');
      },
      error: (err) => {
        this.toastService.error('Error al guardar: ' + (err.error?.message || 'Error interno'));
      }
    });
  }
}