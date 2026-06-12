import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  // 1. CONSTANTES: Las etiquetas únicas para guardar cosas en el disco duro del navegador (localStorage)
  private readonly TOKEN_KEY = 'intellimarket.token';
  private readonly EMAIL_KEY = 'intellimarket.email';
  private readonly ROLE_KEY  = 'intellimarket.role';
  private readonly STORE_KEY = 'intellimarket.storeId';

  // 2. SEÑALES (SIGNALS): El estado en memoria de Angular. Si cambian, toda la app se entera al instante.
  // Al arrancar la app, leen lo que haya guardado previamente en el localStorage.
  token   = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  email   = signal<string | null>(localStorage.getItem(this.EMAIL_KEY));
  role    = signal<string | null>(localStorage.getItem(this.ROLE_KEY));
  storeId = signal<string | null>(localStorage.getItem(this.STORE_KEY));

  // 3. SEÑAL CALCULADA (COMPUTED): Se calcula sola. Si la señal "token" tiene texto, isLoggedIn es true.
  isLoggedIn = computed(() => !!this.token());

  /**
   * MÉTODO PARA GUARDAR LA SESIÓN (Se ejecuta en el Login exitoso)
   */
  save(token: string, email: string, role: string, userId: string, backendStoreId?: string) {
    // A) Guardamos en el almacenamiento local (Persistencia: sobrevive si cierras el navegador)
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.EMAIL_KEY, email);
    localStorage.setItem(this.ROLE_KEY, role);

    // B) Actualizamos las señales de Angular (Reactividad: actualiza las pantallas en tiempo real)
    this.token.set(token);
    this.email.set(email);
    this.role.set(role);

    // C) 💡 EL TRUCO DE LOS ROLES:
    if (role === 'SELLER') {
      // Si es Vendedor, necesita una tienda obligatoriamente.
      // Usamos el ID que mande el backend o, en su defecto, el userId temporal.
      const storeIdToSave = backendStoreId || userId; 
      
      localStorage.setItem(this.STORE_KEY, storeIdToSave);
      this.storeId.set(storeIdToSave); // La señal "storeId" pasa a tener el ID de la tienda
    } else {
      // Si es Cliente (CUSTOMER), NO debe tener tienda bajo ninguna circunstancia.
      localStorage.removeItem(this.STORE_KEY); // Borramos del almacenamiento
      this.storeId.set(null);                  // La señal "storeId" pasa a ser null
    }
  }

  /**
   * MÉTODO PARA CERRAR SESIÓN (Limpia todo)
   */
  clear() {
    localStorage.clear(); // Borra todo el localStorage
    
    // Reseteamos todas las señales a su estado inicial vacío
    this.token.set(null);
    this.email.set(null);
    this.role.set(null);
    this.storeId.set(null);
  }
}