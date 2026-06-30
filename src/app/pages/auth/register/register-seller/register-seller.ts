import { Component, inject } from '@angular/core';
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

  onRegister() {
    this.errorMessage = '';
    
    // Armamos el paquete declarando explícitamente que es un SELLER
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
        this.toastService.success('¡Negocio registrado con éxito! Ahora puedes iniciar sesión.')
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Error al registrar vendedor:', err);
        this.errorMessage = err.error?.message || 'Error al registrar el negocio. Verifica los datos.';
      }
    });
  }
}