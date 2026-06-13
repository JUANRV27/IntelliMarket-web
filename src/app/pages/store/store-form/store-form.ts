import { Component, inject } from '@angular/core';
import { Router} from '@angular/router';
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

    this.storeService.createStore(payload).subscribe({
      next: (res: StoreResponse) => {
        console.log('Tienda creada exitosamente en el backend:', res);
        
        localStorage.setItem('intellimarket.storeId', res.id.toString());
    
        alert(`¡Tienda "${res.name}" creada con éxito!`);
        this.router.navigate(['/seller/inventory']);
      },
      error: (err) => {
        console.error('Error al crear la tienda:', err);
        this.errorMessage = err.error?.message || 'Error al procesar el registro de la tienda.';
      }
    });
  }
}