import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const sellerGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (inject(TokenService).role === 'SELLER') return true;
  
  // Si un customer intenta entrar aquí, lo mandamos a su inicio
  router.navigate(['/']); 
  return false;
};