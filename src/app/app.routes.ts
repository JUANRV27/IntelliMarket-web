import { Routes } from '@angular/router';
import { LayoutSeller } from './layouts/layout-seller/layout-seller';
import { Landing } from './pages/client/landing/landing';
import { Reviews } from './pages/client/reviews/reviews';
import { LandingSeller } from './pages/seller/landing-seller/landing-seller';
import { LoginSeller } from './pages/seller/login-seller/login-seller';
import { CatalogSeller } from './pages/seller/catalog-seller/catalog-seller';
import { ProductDetailSeller } from './pages/seller/product-detail-seller/product-detail-seller';
import { ProfileSeller } from './pages/seller/profile-seller/profile-seller';
import { AuthLayout } from './shared/layouts/auth-layout/auth-layout';
import { Login } from './pages/auth/login/login';
import { RegisterCustomer } from './pages/auth/register/register-customer/register-customer';
import { RegisterSeller } from './pages/auth/register/register-seller/register-seller';
import { ProfileDetail } from './pages/profile/detail/detail';
import { ProfileEdit } from './pages/profile/edit/edit';
import { StoreFormComponent } from './pages/store/store-form/store-form';
import { ListComponent } from './pages/inventory/list/list';
import { FormComponent } from './pages/inventory/form/form';
import { StockSeller } from '../app/pages/inventory/stock/stock-seller';

import { CatalogClient } from './pages/client/catalog-client/catalog-client';
import { CartComponent } from './pages/cart/cart';

import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { StoreSettings } from './pages/store/store-settings/store-settings';

export const routes: Routes = [
  // 1. MÓDULO DE AUTENTICACIÓN (Público - Solo entran si NO tienen sesión)
  /*{
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login, canActivate: [publicGuard] },
      { path: 'register/customer', component: RegisterCustomer, canActivate: [publicGuard] },
      { path: 'register/seller', component: RegisterSeller, canActivate: [publicGuard] }
    ]
  },*/
  // 1. AUTH — lazy, solo carga si el usuario va a /auth
  {
    path: 'auth',
    loadComponent: () => import('./shared/layouts/auth-layout/auth-layout').then(m => m.AuthLayout),
    children: [
      { path: 'login',              canActivate: [publicGuard], loadComponent: () => import('./pages/auth/login/login').then(m => m.Login) },
      { path: 'register/customer',  canActivate: [publicGuard], loadComponent: () => import('./pages/auth/register/register-customer/register-customer').then(m => m.RegisterCustomer) },
      { path: 'register/seller',    canActivate: [publicGuard], loadComponent: () => import('./pages/auth/register/register-seller/register-seller').then(m => m.RegisterSeller) }
    ]
  },

  // Módulo compartido de perfiles básicos (Privado - Solo con sesión)
  /*{ path: 'profile', component: ProfileDetail, canActivate: [authGuard] },
  { path: 'profile/edit', component: ProfileEdit, canActivate: [authGuard] },*/
   // 2. PROFILE — rutas hijas bajo /profile
  {
    path: 'profile',
    canActivate: [authGuard],
    children: [
      { path: '',     loadComponent: () => import('./pages/profile/detail/detail').then(m => m.ProfileDetail) },
      { path: 'edit', loadComponent: () => import('./pages/profile/edit/edit').then(m => m.ProfileEdit) }
    ]
  },
  
  // 2. MÓDULO PRIVADO DEL VENDEDOR (Protegido por authGuard)
  /*{
    path: 'seller',
    component: LayoutSeller,
    canActivate: [authGuard], 
    children: [
      { path: 'inventory', component: ListComponent },
      { path: 'inventory/new', component: FormComponent }, // ¡AQUÍ ESTÁ LA PIEZA FALTANTE!
      { path: 'store/create', component: StoreFormComponent },
      { path: 'catalog', component: CatalogSeller },
      { path: 'product/:id', component: ProductDetailSeller },
      { path: 'profile', component: ProfileSeller },
      { path: 'stock', component: StockSeller },
      { path: 'settings', component: StoreSettings }
    ]
  },*/

  {
    path: 'seller',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/layout-seller/layout-seller').then(m => m.LayoutSeller),
    children: [
      { path: 'catalog',       loadComponent: () => import('./pages/seller/catalog-seller/catalog-seller').then(m => m.CatalogSeller) },
      { path: 'product/:id',   loadComponent: () => import('./pages/seller/product-detail-seller/product-detail-seller').then(m => m.ProductDetailSeller) },
      { path: 'profile',       loadComponent: () => import('./pages/seller/profile-seller/profile-seller').then(m => m.ProfileSeller) },
      { path: 'stock',         loadComponent: () => import('./pages/inventory/stock/stock-seller').then(m => m.StockSeller) },
      { path: 'store/create',  loadComponent: () => import('./pages/store/store-form/store-form').then(m => m.StoreFormComponent) },
      { path: 'settings',      loadComponent: () => import('./pages/store/store-settings/store-settings').then(m => m.StoreSettings) },
      { path: 'stats',         loadComponent: () => import('./pages/seller/stats/stats').then(m => m.StatsSeller) },
      // Inventario usa su propio archivo de rutas hijas (ya estaba bien hecho)
      { path: 'inventory',     loadChildren: () => import('./pages/inventory/inventory.routes').then(m => m.INVENTORY_ROUTES) }
    ]
  },
  // 4. CLIENTE / PÚBLICO — lazy layout + rutas hijas
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/layout-client').then(m => m.LayoutClient),
    children: [
      { path: '',              loadComponent: () => import('./pages/client/landing/landing').then(m => m.Landing) },
      { path: 'reviews',       loadComponent: () => import('./pages/client/reviews/reviews').then(m => m.Reviews) },
      { path: 'catalog',       loadComponent: () => import('./pages/client/catalog-client/catalog-client').then(m => m.CatalogClient) },
      { path: 'cart',          loadComponent: () => import('./pages/cart/cart').then(m => m.CartComponent) },
      { path: 'join-as-seller', loadComponent: () => import('./pages/seller/landing-seller/landing-seller').then(m => m.LandingSeller) },
      { path: 'history', loadComponent: () => import('./pages/client/purchase-history/purchase-history').then(m => m.PurchaseHistoryComponent) }
    ]
  },


  // 3. MÓDULO PÚBLICO / CLIENTE (Ruta raíz principal)
  /*{
    path: '',
    component: LayoutClient,
    children: [
      { path: '', component: Landing }, 
      { path: 'reviews', component: Reviews },
      { path: 'join-as-seller', component: LandingSeller },
      { path: 'seller/login-old', component: LoginSeller },

      { path: 'catalog', component: CatalogClient },
      { path: 'cart', component: CartComponent }
    ]
  },*/

  // 4. RUTAS COMODÍN (Si escriben algo que no existe, los mandamos al inicio)
  { path: '**', redirectTo: '' }
];