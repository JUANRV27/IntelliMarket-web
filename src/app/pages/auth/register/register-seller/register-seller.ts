import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-register-seller',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register-seller.html',
  styleUrl: './register-seller.css'
})
export class RegisterSeller {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  // Variables para el backend
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  errorMessage = '';

  // Modal de error
  showModal = signal(false);
  modalErrors = signal<string[]>([]);

  onRegister() {
    this.errorMessage = '';
    
    // Armamos el paquete declarando explícitamente que es un SELLER
    const errors: string[] = [];

    // VALIDACIÓN CLIENTE: Alimentamos el modal antes de ir al servidor
    if (!this.firstName.trim()) errors.push('El nombre del representante es obligatorio.');
    if (!this.lastName.trim()) errors.push('Los apellidos del representante son obligatorios.');
    
    if (!this.email.includes('@')) {
      errors.push("El correo electrónico debe contener un '@'.");
    }
    if (this.email.length > 30) {
      errors.push('El correo electrónico no debe superar los 30 caracteres.');
    }
    if (this.password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres.');
    }

    // Si existen inconsistencias locales, abrimos el modal y frenamos la petición
    if (errors.length > 0) {
      this.modalErrors.set(errors);
      this.showModal.set(true);
      return;
    }
    
    const payload = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      role: 'SELLER' as const 
    };

    // Llamada real al backend
    this.authService.register(payload).subscribe({
      next: (res) => {
        console.log('Registro de vendedor exitoso', res);
        this.toastService.success('¡Negocio registrado con éxito! Ahora puedes iniciar sesión.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        //console.error('Error al registrar vendedor:', err);
        //this.errorMessage = err.error?.message || 'Error al registrar el negocio. Verifica los datos.';
        console.error('Error al registrar vendedor:', err);
        const backendMessage = err.error?.message || 'Error al registrar el negocio. Verifica los datos.';
        
        this.modalErrors.set([backendMessage]);
        this.showModal.set(true);
      }
    });
  }

  cerrarModal() {
    this.showModal.set(false);
    this.modalErrors.set([]);
  }
}