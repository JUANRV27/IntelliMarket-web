export interface ProfileResponse {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address?: string | null;  // Solo customer
  dni?: string | null;      // Solo owner
}

export interface CustomerProfileRequest {
  phone?: string;
  address?: string;
}

export interface OwnerProfileRequest {
  phone?: string;
  dni?: string;
}