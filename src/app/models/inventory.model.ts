import {Product} from "./product.model"
import {Store} from "./store.model"

export interface Inventory{
    id: number;
    product: Product;
    store: Store;
    stock: number;
    state: number;
    price: number;
    updatedAt: string;
}