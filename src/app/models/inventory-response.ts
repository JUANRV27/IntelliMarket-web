import {ProductsResponse} from "./products-response";

export interface InventoryResponse {
    id: number;
    product: ProductsResponse;
    quantity: number;
    store: string;
    price: number;
    stock: number;
    state: number;
    updatedAt: string; // ISO Date con String
}