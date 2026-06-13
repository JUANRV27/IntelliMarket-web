import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isLoggedIn()) {
    return true; // Déjalo pasar porque NO ha iniciado sesión
  }
  
  // Si ya tiene sesión, lo mandamos a la tienda principal
  router.navigate(['/']);
  return false;
};