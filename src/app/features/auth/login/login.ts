import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TokenService } from '../../../core/services/token.service'; // <-- 1. Importamos el TokenService

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private router = inject(Router);
  private tokenService = inject(TokenService); // <-- 2. Lo inyectamos

  onLogin() {
    console.log('Simulando inicio de sesión exitoso...');
    
    // 3. Simulamos que el backend nos entregó estos datos
    // Guardamos un token falso, un correo y el rol de CUSTOMER
    this.tokenService.save('token-falso-12345', 'juan.perez@gmail.com', 'CUSTOMER');
    
    // 4. Ahora sí, viajamos a la página principal
    this.router.navigate(['/']); 
  }
}