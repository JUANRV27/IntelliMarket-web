import {Category} from "./category-products";

export interface ProductsResponse {
  id: string;
  name: string;
  description: string;
  category: Category;
  unitPrice: number;
  imageUrl: string;
  createdAt: string; // ISO Date con String
  stock: number;       // Mapeado de inventory.stock
  price: number;       // Mapeado de inventory.price
}