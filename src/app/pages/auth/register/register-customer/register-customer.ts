import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-register-customer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register-customer.html',
  styleUrl: './register-customer.css' // Ajusta si tu css se llama diferente
})
export class RegisterCustomer {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  // Variables exactas que pide el backend
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  errorMessage = '';

  // Modal de error
  showModal = signal(false)
  modalErrors = signal<string[]>([])

  

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
    
    // Armamos el paquete exacto para Spring Boot
    const payload = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      role: 'CUSTOMER' as const // ¡El backend exige saber qué rol es!
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        console.log('Registro exitoso', res);
        this.toastService.success('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.')
        this.router.navigate(['/auth/login']); // Te redirige al login
      },
      error: (err) => {
        //console.error('Error del backend:', err);
        // Si el backend manda un mensaje específico, lo mostramos
        //this.errorMessage = err.error?.message || 'Error al registrar. Verifica los datos o si el correo ya existe.';
        console.error('Error al registrar cliente:', err);
        const backendMessage = err.error?.message || 'Error al registrar el cliente. Verifica los datos.';
        
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