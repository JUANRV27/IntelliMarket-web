import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  // Si está logueado, pasa. Si no, patada al login.
  if (inject(TokenService).isLoggedIn()) return true;
  
  router.navigate(['/auth/login']);
  return false;
};