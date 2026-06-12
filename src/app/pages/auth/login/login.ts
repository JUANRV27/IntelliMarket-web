import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  // 1. Inyectamos la herramienta para forzar la actualización visual
  private cdr = inject(ChangeDetectorRef); 

  email = '';
  password = '';
  errorMessage = '';

  // 2. Este método limpia el error en cuanto el usuario vuelve a teclear
  ocultarError() {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  onLogin() {
    this.errorMessage = '';
    
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Autenticación exitosa', response);
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error('Error en el backend:', err);
        
        // Asignamos el mensaje y borramos la clave
        this.errorMessage = 'Correo o contraseña incorrectos.';
        this.password = '';
        
        // 3. ¡La magia! Le decimos a Angular que refresque la pantalla de inmediato
        this.cdr.detectChanges();
      }
    });
  }
}