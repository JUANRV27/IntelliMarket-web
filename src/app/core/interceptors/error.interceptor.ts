import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../../services/token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Dejamos pasar la petición normalmente, pero "interceptamos" si hay un error de vuelta
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Si el backend dice "Acceso no autorizado" o token vencido
      if (error.status === 401) {
        console.warn('Sesión expirada o inválida. Expulsando usuario...');
        tokenService.clear(); // Limpiamos el disco duro del navegador
        alert('Tu sesión ha expirado por seguridad. Inicia sesión nuevamente.');
        router.navigate(['/auth/login']); // Lo mandamos afuera
      }
      
      // Seguimos lanzando el error por si la consola lo quiere leer
      return throwError(() => error);
    })
  );
};