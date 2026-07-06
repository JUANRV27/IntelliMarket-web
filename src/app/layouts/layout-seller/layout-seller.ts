import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { CommonModule } from '@angular/common';
import { ChatBubble } from '../../shared/components/chat-bubble/chat-bubble';
import { map } from 'rxjs/internal/operators/map';
import { filter } from 'rxjs/internal/operators/filter';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-layout-seller',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ChatBubble],  // <- agregado
  templateUrl: './layout-seller.html',
  styleUrl: './layout-seller.css'
})
export class LayoutSeller implements OnInit {
  private router       = inject(Router);
  private tokenService = inject(TokenService);

  storeNameRaw = signal('Mi Tienda');
  storeLogo = signal<string | null>(null);

  // Escuchamos de forma reactiva los eventos de navegación de las rutas hijas
  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: any) => event.urlAfterRedirects || event.url)
    ),
    { initialValue: this.router.url }
  );

  storeName = computed(() => {
    const url = this.currentUrl();
    if (url && url.includes('store/create')) {
      return 'Crear Tienda';
    }
    return this.storeNameRaw();
  });

  ngOnInit(): void {
    const savedName = localStorage.getItem('intellimarket.storeName');
    if (savedName) this.storeNameRaw.set(savedName);

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