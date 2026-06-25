import {Category} from "./category-products";

export interface ProductsResponse {
  id: number;
  name: string;
  description: string;
  category: Category;
  unitPrice: number;
  imageUrl: string;
  createdAt: string; // ISO Date con String
  stock: number;       // Mapeado de inventory.stock
  price: number;       // Mapeado de inventory.price
  storeId: number;     // Ahora siempre viene del backend (antes opcional/ausente)
  //storeName?: string;  // útil para "Vendido por: X"
}