import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../../services/store.service';
import { StoreRequest } from '../../../models/store-request';
import { StoreResponse } from '../../../models/store-response';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './store-form.html',
  styleUrl: './store-form.css'
})
export class StoreFormComponent {
  private storeService = inject(StoreService);
  private router = inject(Router);

  name = '';
  address = '';
  district = '';
  errorMessage = '';

  onCreateStore() {
    this.errorMessage = '';

    if (!this.name.trim() || !this.address.trim() || !this.district.trim()) {
      this.errorMessage = 'Por favor, complete todos los campos obligatorios.';
      return;
    }

    const payload: StoreRequest = {
      name: this.name,
      address: this.address,
      district: this.district
    };

    console.log('Enviando solicitud de creación de tienda al backend:', payload);

    this.storeService.createStore(payload).subscribe({
      next: (res: StoreResponse) => {
        console.log('Tienda creada exitosamente en el backend (StoreResponse):', res);
        
        // 💡 SOLUCIÓN CRÍTICA: Capturamos el verdadero ID autoincremental de la base de datos 
        // enviado por el backend (res.id) y reemplazamos el id erróneo en el LocalStorage.
        if (res && res.id) {
          localStorage.setItem('intellimarket.storeId', res.id.toString());
          localStorage.setItem('intellimarket.storeName', res.name);
          console.log(`[STORAGE] Sincronizado intellimarket.storeId con el ID real de BD: ${res.id}`);
        } else {
          console.warn('El backend no retornó un ID válido en la respuesta. Usando valor "1" de contingencia.');
          localStorage.setItem('intellimarket.storeId', '1');
        }
    
        alert(`¡Tienda "${res.name}" creada con éxito!`);
        console.log('Redirigiendo al catálogo unificado...');
        this.router.navigate(['/seller/catalog']);
              },
      error: (err) => {
        console.error('Error al crear la tienda:', err);
        this.errorMessage = err.error?.message || 'Error al procesar el registro de la tienda.';
      }
    });
  }
}