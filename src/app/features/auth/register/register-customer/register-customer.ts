import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-customer',
  imports: [RouterLink],
  templateUrl: './register-customer.html',
  styleUrl: './register-customer.css'
})
export class RegisterCustomer {
  private router = inject(Router);

  onRegister() {
    console.log('Cliente registrado de manera simulada.');
    this.router.navigate(['/auth/login']); // Regresa al login
  }
}