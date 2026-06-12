import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const customerGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (inject(TokenService).role() === 'CUSTOMER') return true;
  
  router.navigate(['/']); 
  return false;
};