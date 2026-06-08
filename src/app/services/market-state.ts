import { Injectable, signal, effect } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  tag: string;
  image: string;
  isVisible: boolean;
}

export interface SellerProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  apartment: string;
  reference: string;
  paymentMethods: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class MarketStateService {
  // Signals
  readonly isSellerLoggedIn = signal<boolean>(false);
  readonly products = signal<Product[]>([]);
  readonly profile = signal<SellerProfile>({
    name: 'Mauricio Canchis',
    phone: '999999999',
    email: 'mauriciocan@gmail.com',
    address: 'UPC Monterrico',
    apartment: 'Dpto 402',
    reference: 'Frente al parque principal',
    paymentMethods: ['Tarjeta de Crédito', 'Yape / Plin', 'Efectivo', 'Transferencia']
  });
  readonly reviews = signal<Review[]>([
    { id: '1', author: 'Ana Pérez', rating: 5, comment: 'Me facilito el esfuerzo de tener que averiguar los precios' },
    { id: '2', author: 'Carlos C.', rating: 5, comment: 'Excelente servicio' },
    { id: '3', author: 'María López', rating: 5, comment: 'Me encanta comprar aquí, siempre hay algo nuevo.' }
  ]);

  private readonly STORAGE_PRODUCTS_KEY = 'intellimarket_products';
  private readonly STORAGE_PROFILE_KEY = 'intellimarket_profile';
  private readonly STORAGE_LOGIN_KEY = 'intellimarket_seller_login';

  constructor() {
    this.loadInitialState();

    // Setup effects to automatically sync state to localStorage on changes
    effect(() => {
      localStorage.setItem(this.STORAGE_PRODUCTS_KEY, JSON.stringify(this.products()));
    });

    effect(() => {
      localStorage.setItem(this.STORAGE_PROFILE_KEY, JSON.stringify(this.profile()));
    });

    effect(() => {
      localStorage.setItem(this.STORAGE_LOGIN_KEY, String(this.isSellerLoggedIn()));
    });
  }

  private loadInitialState(): void {
    // 1. Login status
    const storedLogin = localStorage.getItem(this.STORAGE_LOGIN_KEY);
    if (storedLogin) {
      this.isSellerLoggedIn.set(storedLogin === 'true');
    }

    // 2. Profile
    const storedProfile = localStorage.getItem(this.STORAGE_PROFILE_KEY);
    if (storedProfile) {
      try {
        this.profile.set(JSON.parse(storedProfile));
      } catch (e) {
        console.error('Failed to parse stored profile', e);
      }
    }

    // 3. Products list (defaults from figma if not in localStorage)
    const storedProducts = localStorage.getItem(this.STORAGE_PRODUCTS_KEY);
    if (storedProducts) {
      try {
        this.products.set(JSON.parse(storedProducts));
      } catch (e) {
        console.error('Failed to parse stored products', e);
        this.resetProductsToDefaults();
      }
    } else {
      this.resetProductsToDefaults();
    }
  }

  private resetProductsToDefaults(): void {
    this.products.set([
      {
        id: '1',
        name: 'Inca Kola 600ml',
        price: 3.60,
        description: 'Gaseosa Inka Kola Botella 600ml\n\nEspecificaciones:\nBotella 600ml',
        tag: 'Nuevo',
        image: 'http://localhost:3845/assets/53d13b256d0eb1f1e4fae1093b2999252fb2cfae.png',
        isVisible: true
      },
      {
        id: '2',
        name: 'Coca-Cola 250 PET 12 Unidades',
        price: 8.50,
        description: 'Coca-Cola 250 PET 12 Unidades. Gaseosa refrescante ideal para comidas familiares.',
        tag: 'Venta',
        image: 'http://localhost:3845/assets/fa2159683bd0c73b733c40e39f85d83c5262164e.png',
        isVisible: true
      },
      {
        id: '3',
        name: 'Leche Gloria Chocolate Caja Pack 6un',
        price: 9.30,
        description: 'Leche Gloria Sabor Chocolate Caja 180ml Paquete 6un. Deliciosa bebida láctea chocolatada para la lonchera.',
        tag: 'Oferta',
        image: 'http://localhost:3845/assets/de5fde80a02c7038c0ebbd69179700a0b06ba001.png',
        isVisible: true
      },
      {
        id: '4',
        name: 'Elite Ultra Suave Doble Hoja x32',
        price: 26.60,
        description: 'Elite Ultra Suave - Doble Hoja 22m x32. Máxima suavidad y rendimiento para tu hogar.',
        tag: 'Popular',
        image: 'http://localhost:3845/assets/8c053524b453ee7d8c0930e873549b03ee0ea42e.png',
        isVisible: true
      },
      {
        id: '5',
        name: 'Cusqueña Cero Trigo Botella Pack 6un',
        price: 24.90,
        description: 'Cerveza Cusqueña Cero Trigo Botella 310 ml Paquete 6un. Cerveza premium peruana con un cuerpo especial.',
        tag: 'Nuevo',
        image: 'http://localhost:3845/assets/b3ae71c97dc722d21d097c889f2fcc1c7c690c83.png',
        isVisible: true
      },
      {
        id: '6',
        name: 'Agua alcalina Cielo Pack 15 botellas',
        price: 30.00,
        description: 'Agua alcalina Cielo 650ml Pack 15 botellas. Mantente hidratado con agua de PH balanceado.',
        tag: 'Recomendado',
        image: 'http://localhost:3845/assets/f9557de0fefdc90b4649f2c94b515e9a9296f99c.png',
        isVisible: true
      }
    ]);
  }

  // Actions
  loginAsSeller(): void {
    this.isSellerLoggedIn.set(true);
  }

  logoutAsSeller(): void {
    this.isSellerLoggedIn.set(false);
  }

  updateProfile(profileData: SellerProfile): void {
    this.profile.set({ ...profileData });
  }

  toggleProductVisibility(productId: string): void {
    this.products.update(currProducts =>
      currProducts.map(p => p.id === productId ? { ...p, isVisible: !p.isVisible } : p)
    );
  }

  addProduct(product: Omit<Product, 'id'>): void {
    const nextId = String(this.products().length + 1);
    const newProduct: Product = {
      ...product,
      id: nextId
    };
    this.products.update(currProducts => [...currProducts, newProduct]);
  }

  addReview(author: string, rating: number, comment: string): void {
    const newReview: Review = {
      id: String(this.reviews().length + 1),
      author,
      rating,
      comment
    };
    this.reviews.update(currReviews => [newReview, ...currReviews]);
  }
}
