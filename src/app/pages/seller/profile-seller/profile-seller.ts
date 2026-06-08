import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MarketStateService, SellerProfile } from '../../../services/market-state';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-seller',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile-seller.html',
  styleUrl: './profile-seller.css'
})
export class ProfileSeller {
  stateService = inject(MarketStateService);
  router = inject(Router);

  isEditing = signal(false);

  // Edit fields
  editName = signal('');
  editPhone = signal('');
  editEmail = signal('');
  editAddress = signal('');
  editApartment = signal('');
  editReference = signal('');
  editPaymentMethods = signal<string[]>([]);

  profileData = computed(() => this.stateService.profile());

  availablePaymentMethods = [
    'Tarjeta de Crédito',
    'Yape / Plin',
    'Efectivo',
    'Transferencia'
  ];

  startEditing(): void {
    const data = this.profileData();
    this.editName.set(data.name);
    this.editPhone.set(data.phone);
    this.editEmail.set(data.email);
    this.editAddress.set(data.address);
    this.editApartment.set(data.apartment);
    this.editReference.set(data.reference);
    this.editPaymentMethods.set([...data.paymentMethods]);
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
  }

  saveProfile(): void {
    if (!this.editName().trim() || !this.editPhone().trim() || !this.editEmail().trim()) {
      alert('Por favor ingrese los campos obligatorios: Nombre, Teléfono, Correo');
      return;
    }

    this.stateService.updateProfile({
      name: this.editName(),
      phone: this.editPhone(),
      email: this.editEmail(),
      address: this.editAddress(),
      apartment: this.editApartment(),
      reference: this.editReference(),
      paymentMethods: this.editPaymentMethods()
    });

    this.isEditing.set(false);
  }

  togglePaymentMethod(method: string): void {
    if (!this.isEditing()) return;
    
    const current = this.editPaymentMethods();
    if (current.includes(method)) {
      this.editPaymentMethods.set(current.filter(m => m !== method));
    } else {
      this.editPaymentMethods.set([...current, method]);
    }
  }

  isMethodSelected(method: string): boolean {
    if (this.isEditing()) {
      return this.editPaymentMethods().includes(method);
    }
    return this.profileData().paymentMethods.includes(method);
  }
}
