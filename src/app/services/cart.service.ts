import { Injectable, signal, computed } from '@angular/core';

// Interfaz que define exactamente qué guardamos en el carrito
export interface CartItem {
  productId: string;
  name: string;
  price: number;
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
    this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );

  addToCart(product: any) {
    this.cartItems.update(items => {
      // Verificar si el producto ya está en el carrito
      const existingItem = items.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Si existe, le sumamos 1 a la cantidad
        return items.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      // Si es nuevo, lo agregamos a la lista con cantidad 1
      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || 'assets/default-product.png',
        quantity: 1
      };
      
      return [...items, newItem];
    });
  }

  removeFromCart(productId: string) {
    // Filtramos el array para dejar fuera al producto que queremos eliminar
    this.cartItems.update(items => items.filter(item => item.productId !== productId));
  }

  clearCart() {
    this.cartItems.set([]);
  }
}