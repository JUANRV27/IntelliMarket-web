import {Category} from "./category-products";

export interface Product{
    id: number;
    name: string;
    category: Category;
    description: string;
    imageUrl: string;
    unitPrice: number;
    createdAt: string;
}