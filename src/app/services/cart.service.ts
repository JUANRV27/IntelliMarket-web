import { Injectable, signal, computed } from '@angular/core';

// Interfaz que define exactamente qué guardamos en el carrito
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  unitPrice?: number;
  imageUrl: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Estado reactivo principal
  cartItems = signal<CartItem[]>([]);

  // Estados computados (se actualizan solos cuando cartItems cambia)
  totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() => 
    this.cartItems().reduce((acc, item) =>  {
      const itemPrice = item.unitPrice || item.price || 0; // Aseguramos que siempre haya un precio válido
      return acc + (itemPrice * item.quantity);
    }, 0)
      
  );

  addToCart(product: any) {
    const currentItems = this.cartItems();

    const targetId = product.id || product.productId;
    const existingItem = currentItems.find(item => item.productId === targetId);

      if (existingItem) {
        // Si existe, le sumamos 1 a la cantidad
        this.updateQuantity(existingItem.productId, existingItem.quantity + 1);
      } else {
      const precioCorrecto = product.unitPrice || product.price || 0;
      // Si es nuevo, lo agregamos a la lista con cantidad 1
      const newItem: CartItem = {
        productId: targetId,
        name: product.name,
        imageUrl: product.imageUrl || 'assets/default-product.png',
        price: precioCorrecto,
        unitPrice: precioCorrecto,
        quantity: 1
      };

      this.cartItems.set([...currentItems, newItem]);
    }
  }

  updateQuantity(productId: string, newQuantity: number) {
    this.cartItems.update(items =>
      items.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  removeFromCart(productId: string) {
    // Filtramos el array para dejar fuera al producto que queremos eliminar
    this.cartItems.update(items => items.filter(item => item.productId !== productId));
  }

  clearCart() {
    this.cartItems.set([]);
  }
}