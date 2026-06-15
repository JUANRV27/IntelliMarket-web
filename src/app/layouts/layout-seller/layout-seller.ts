import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-layout-seller',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout-seller.html',
  styleUrl: './layout-seller.css'
})
export class LayoutSeller implements OnInit {
  private router       = inject(Router);
  private tokenService = inject(TokenService);

  storeName = signal('Mi Tienda');

  ngOnInit(): void {
    const saved = localStorage.getItem('intellimarket.storeName');
    if (saved) this.storeName.set(saved);
  }

  logout(): void {
    this.tokenService.clear();
    // ✅ FIX: ruta correcta
    this.router.navigate(['/auth/login']);
  }
}