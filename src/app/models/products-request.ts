import {Category} from "./category-products";

export interface ProductsRequest {
  name: string;
  description: string;
  category: Category;
  // BigDecimal price
  stock: number;
  unitPrice: number;
  imageUrl: string;
}