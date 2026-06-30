import { Component, inject, signal, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service'; // Ajusta la ruta de tu servicio
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';


@Component({
  selector: 'app-store-settings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './store-settings.html',
  styleUrl: './store-settings.css'
})
export class StoreSettings implements OnInit {
  private storeService = inject(StoreService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  storeId = signal<string>('');
  isLoading = signal<boolean>(true);

  // Señales reactivas para los inputs del formulario
  storeName = signal<string>('');
  storeAddress = signal<string>('');
  storeDistrict = signal<string>('');

  ngOnInit(): void {
    const savedStoreId = localStorage.getItem('intellimarket.storeId');
    if (savedStoreId) {
      this.storeId.set(savedStoreId);
      this.loadStoreData();
    } else {
      console.error('No se encontró storeId para configurar.');
      this.router.navigate(['/login']);
    }
  }

  // Carga los datos iniciales de la tienda de la BD
  loadStoreData(): void {
    this.storeService.getStoreById(this.storeId()).subscribe({
      next: (store) => {
        this.storeName.set(store.name);
        this.storeAddress.set(store.address);
        this.storeDistrict.set(store.district);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar datos de la tienda:', err);
        this.toastService.error('No se pudieron recuperar los datos de la tienda');
        this.isLoading.set(false);
      }
    });
  }

  // Enviar los datos actualizados al backend
  onSubmitStore(): void {
    if (!this.storeName().trim() || !this.storeAddress().trim() || !this.storeDistrict().trim()) {
      this.toastService.error('Por favor complete todos los campos obligatorios');
      return;
    }

    const payload = {
      name: this.storeName(),
      address: this.storeAddress(),
      district: this.storeDistrict()
    };

    console.log(`[STORE-SETTINGS] Actualizando tienda ${this.storeId()}...`, payload);

    this.storeService.updateStore(this.storeId(), payload).subscribe({
      next: (res) => {
        this.toastService.success('¡Datos de la tienda actualizados con éxito!');
        // Opcional: Actualizar el nombre de la tienda en memoria si lo usas en un navbar
        this.router.navigate(['/seller/catalog']);
      },
      error: (err) => {
        console.error('Error al actualizar tienda:', err);
        this.toastService.error('Error al guardar cambios: ' + (err.error?.message || err.message));
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/seller/catalog']);
  }
}