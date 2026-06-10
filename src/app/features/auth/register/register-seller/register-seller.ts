import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-seller',
  imports: [RouterLink],
  templateUrl: './register-seller.html',
  styleUrl: './register-seller.css'
})
export class RegisterSeller {
  private router = inject(Router);

  onRegister() {
    console.log('Vendedor registrado de manera simulada.');
    this.router.navigate(['/auth/login']); // Regresa al login
  }
}