export interface Review {
  id: number;
  productId: number;
  rating: number; // 1-5 estrellas
  comment: string;
  author: string;
  createdAt?: string;
}

export interface ReviewRequest {
  productId: number;
  rating: number;
  comment: string;
  author: string;
}

