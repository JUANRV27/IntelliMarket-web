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
  // CONSTANTE DE LLAVE DE SEGURIDAD PARA LOCAL STORAGE
  private readonly STORAGE_KEY = 'intellimarket.cart_items';

  // Estado reactivo principal
  cartItems = signal<CartItem[]>([]);

  // Estados computados (se actualizan solos cuando cartItems cambia)
  totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );

  constructor() {
    // Cargar el carrito guardado al inicializar el servicio
    this.loadCartFromStorage();
  }

  /**
   * Carga el carrito desde localStorage
   */
  private loadCartFromStorage() {
    try {
      const savedCart = localStorage.getItem(this.STORAGE_KEY);
      if (savedCart) {
        const items = JSON.parse(savedCart);
        this.cartItems.set(items);
        console.log('✅ Carrito cargado desde localStorage:', items);
      }
    } catch (error) {
      console.warn('Error al cargar carrito desde localStorage:', error);
    }
  }

  /**
   * Guarda el carrito en localStorage
   */
  private saveCartToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems()));
      console.log('✅ Carrito guardado en localStorage');
    } catch (error) {
      console.warn('Error al guardar carrito en localStorage:', error);
    }
  }

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
        price: product.unitPrice || product.price,
        imageUrl: product.imageUrl || 'assets/default-product.png',
        quantity: 1
      };
      
      return [...items, newItem];
    });

    // Guardar en localStorage después de agregar
    this.saveCartToStorage();
  }

  removeFromCart(productId: string) {
    // Filtramos el array para dejar fuera al producto que queremos eliminar
    this.cartItems.update(items => items.filter(item => item.productId !== productId));
    
    // Guardar en localStorage después de eliminar
    this.saveCartToStorage();
  }

  clearCart() {
    this.cartItems.set([]);
    
    // Guardar en localStorage (vaciar)
    this.saveCartToStorage();
  }

  /**
   * Recarga el carrito desde localStorage
   * Útil cuando el usuario inicia sesión
   */
  reloadCartFromStorage() {
    this.loadCartFromStorage();
  }
}