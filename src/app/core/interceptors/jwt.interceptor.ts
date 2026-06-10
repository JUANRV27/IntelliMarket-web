import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos tu servicio para obtener el token guardado
  const tokenService = inject(TokenService);
  
  // Obtenemos el token (ajusta esto si en tu TokenService se llama distinto, ej: tokenService.token())
  // Si tu servicio usa localStorage directamente, también puedes usar: localStorage.getItem('token')
  const token = tokenService.token;

  // Si el usuario tiene un token guardado (es decir, inició sesión)
  if (token) {
    // Clonamos la petición original y le inyectamos la cabecera "Authorization"
    const peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Dejamos que la petición continúe su viaje hacia Spring Boot, pero ahora va "firmada"
    return next(peticionClonada);
  }

  // Si no hay token (ej. alguien visitando la tienda pública), la dejamos pasar normal
  return next(req);
};