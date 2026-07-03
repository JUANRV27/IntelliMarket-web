import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { CommonModule } from '@angular/common';
import { ChatBubble } from '../../shared/components/chat-bubble/chat-bubble';

@Component({
  selector: 'app-layout-seller',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ChatBubble],  // <- agregado
  templateUrl: './layout-seller.html',
  styleUrl: './layout-seller.css'
})
export class LayoutSeller implements OnInit {
  private router       = inject(Router);
  private tokenService = inject(TokenService);

  storeName = signal('Mi Tienda');
  storeLogo = signal<string | null>(null);

  ngOnInit(): void {
    const savedName = localStorage.getItem('intellimarket.storeName');
    if (savedName) this.storeName.set(savedName);

    // Leemos el logo persistido en el navegador
    const savedLogo = localStorage.getItem('intellimarket.storeLogo');
    if (savedLogo && savedLogo.trim() !== '') {
      this.storeLogo.set(savedLogo);
    }
  }

  logout(): void {
    this.tokenService.clear();
    // ruta correcta
    this.router.navigate(['/auth/login']);
  }
}