import { Component, inject, signal } from '@angular/core';
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
  private router       = inject(Router);

  // Propiedades bindeades con ngModel en el HTML
  name         = '';
  address      = '';
  district     = '';
  errorMessage = '';

  // SEÑAL REACTIVA: Resuelve el problema de actualización asíncrona de la UI
  public imagePreview = signal<string | null>(null);

  // Señal reactiva al crearse una tienda correctamente para mostrar un modal de éxito
  public showSuccessModal = signal<boolean>(false);
  
  // Almacena el valor Base64 puro listo para viajar en el JSON del Payload
  private imageBase64: string | null = null;

  /**
   * Captura el archivo del input, lo transforma a Base64 de forma asíncrona
   * e impacta la señal reactiva para forzar el repintado inmediato en el HTML.
   */
  onFileSelected(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      
      // Notificamos a la señal. Angular redibuja el bloque @else en milisegundos.
      this.imagePreview.set(base64);
      this.imageBase64 = base64;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Precarga una imagen existente (Útil si en el futuro reutilizas este formulario para Editar)
   */
  preloadImage(base64Image: string): void {
    this.imagePreview.set(base64Image);
    this.imageBase64 = base64Image;
  }

  /**
   * Resetea el flujo de la imagen permitiendo que vuelva a aparecer la zona de clic (Dropzone)
   */
  removeImage(): void {
    this.imagePreview.set(null);
    this.imageBase64 = null;
  }

  // Navegar hacia catalog-seller después de cerrar el modal de éxito
  onNavigateToCatalog(): void {
    this.showSuccessModal.set(false);
    this.router.navigate(['/seller/catalog']);
  }

  /**
   * Envía el JSON estructurado al StoreService para dar de alta la tienda en PostgreSQL
   */
  onCreateStore(): void {
    this.errorMessage = '';

    // Validación defensiva básica en el cliente
    if (!this.name.trim() || !this.address.trim() || !this.district.trim()) {
      this.errorMessage = 'Por favor, complete todos los campos obligatorios.';
      return;
    }

    // Construcción del Payload respetando la interfaz StoreRequest
    const payload: StoreRequest = {
      name:     this.name.trim(),
      address:  this.address.trim(),
      district: this.district.trim(),
      imageUrl: this.imageBase64 || undefined // Viaja como String Base64 si existe
    };

    this.storeService.createStore(payload).subscribe({
      next: (res: StoreResponse) => {
        if (res?.id) {
          // Guardamos las credenciales de la tienda operativa en almacenamiento local
          localStorage.setItem('intellimarket.storeId',   res.id.toString());
          localStorage.setItem('intellimarket.storeName', res.name);
          localStorage.setItem('intellimarket.storeLogo', res.imageUrl || this.imageBase64 || '');
        }
        this.showSuccessModal.set(true);
        //alert(`¡Tienda "${res.name}" creada con éxito!`);
        //this.router.navigate(['/seller/catalog']);
      },
      error: (err) => {
        console.error('🔴 Error al crear la tienda:', err);
        this.errorMessage = err.error?.message || 'Error al procesar el registro de la tienda.';
      }
    });
  }
}