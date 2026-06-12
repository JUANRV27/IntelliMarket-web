import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TokenService } from '../../../core/services/token.service'; // <-- 1. Importamos el TokenService
import { FormsModule } from '@angular/forms'; // 💡 IMPORTANTE: Para usar [(ngModel)] en los inputs del HTML
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private router = inject(Router);
  // AuthService es el servicio que se encargará de hacer la petición HTTP al backend para autenticar al usuario
  private authService = inject(AuthService); // <-- 2. Lo inyectamos
    
  // Señales reactivas para capturar lo que el usuario escribe en el formulario HTML
  email = signal('');
  password = signal('');
  errorMessage = signal<string | null>(null);

  /**
  * Método de Login Real conectado a tu base de datos mediante Spring Boot
  */
  onLogin() {
    this.errorMessage.set(null); // Limpiamos errores previos

    // Validamos de forma preventiva en el frontend
    if (!this.email().trim() || !this.password().trim()) {
      this.errorMessage.set('Por favor, complete todos los campos.');
      return;
    }

    const loginPayload = {
      email: this.email(),
      password: this.password()
    };

    console.log('Enviando credenciales reales a Spring Boot...');

    // Disparamos la petición HTTP POST real a través del AuthService
    this.authService.login(loginPayload).subscribe({
      next: (response) => {
        console.log('¡Login Exitoso! Servidor procesó las credenciales correctamente.', response);
          
        // 💡 DINAMISMO AUTOMÁTICO DE RUTAS SEGÚN EL ROL REAL DE LA BASE DE DATOS:
        if (response.role === 'SELLER') {
          // Si es vendedor, lo mandamos a su panel/catálogo de ventas (donde usará tu storeId)
          this.router.navigate(['/seller/catalog']);
        } else {
          // Si es cliente (CUSTOMER), lo mandamos al catálogo de compras general
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Error en la autenticación con el Backend:', err);
        this.errorMessage.set('Credenciales inválidas o error de conexión con el servidor.');
          alert('Error al iniciar sesión. Verifica que tus datos existan en la BD y Spring Boot esté corriendo.');
      }
    });
  }
}