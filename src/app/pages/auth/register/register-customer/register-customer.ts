import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

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

  // Variables exactas que pide el backend
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  errorMessage = '';

  onRegister() {
    this.errorMessage = '';
    
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
        alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        this.router.navigate(['/auth/login']); // Te redirige al login
      },
      error: (err) => {
        console.error('Error del backend:', err);
        // Si el backend manda un mensaje específico, lo mostramos
        this.errorMessage = err.error?.message || 'Error al registrar. Verifica los datos o si el correo ya existe.';
      }
    });
  }
}