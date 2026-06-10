import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './auth-layout.html',
  styleUrls: ['./auth-layout.css'],
})
export class AuthLayout {}
