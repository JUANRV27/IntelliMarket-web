export type Role = 'CUSTOMER' | 'SELLER';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role; // <-- ¡NUEVO! Tu backend lo pide
}

export interface AuthResponse {
  id: number;
  email: string;
  role: Role; 
  token: string; // <-- Ojo: Confirma que se lo agregaste a tu AuthResponse en Java
}