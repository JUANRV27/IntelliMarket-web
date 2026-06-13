import {Category} from "./category-products";

export interface ProductsRequest {
  name: string;
  description: string;
  category: Category;
  // BigDecimal price
  unitPrice: number;
  imageUrl: string;
}