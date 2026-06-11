import { Routes } from '@angular/router';
import { LayoutClient } from './layouts/layout-client/layout-client';
import { LayoutSeller } from './layouts/layout-seller/layout-seller';
import { Landing } from './pages/client/landing/landing';
import { Reviews } from './pages/client/reviews/reviews';
import { LandingSeller } from './pages/seller/landing-seller/landing-seller';
import { LoginSeller } from './pages/seller/login-seller/login-seller';
import { CatalogSeller } from './pages/seller/catalog-seller/catalog-seller';
import { ProductDetailSeller } from './pages/seller/product-detail-seller/product-detail-seller';
import { ProfileSeller } from './pages/seller/profile-seller/profile-seller';
import { AuthLayout } from './shared/layouts/auth-layout/auth-layout';
import { Login } from './features/auth/login/login';
import { RegisterCustomer } from './features/auth/register/register-customer/register-customer';
import { RegisterSeller } from './features/auth/register/register-seller/register-seller';
import { ProfileDetail } from './features/profile/detail/detail';
import { ProfileEdit } from './features/profile/edit/edit';

export const routes: Routes = [
  // 1. MÓDULO DE AUTENTICACIÓN Y SEGURIDAD (Tus Pantallas)
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'register/customer', component: RegisterCustomer },
      { path: 'register/seller', component: RegisterSeller }
    ]
  },

  // Tu módulo de perfiles
  { path: 'profile', component: ProfileDetail },
  { path: 'profile/edit', component: ProfileEdit },

  // 2. MÓDULO PÚBLICO (Tienda / Landing)
  {
    path: '',
    component: LayoutClient,
    children: [
      { path: '', component: Landing },
      { path: 'reviews', component: Reviews },
      { path: 'seller', component: LandingSeller },
      { path: 'seller/login', component: LoginSeller }
    ]
  },
  
  // 3. MÓDULO PRIVADO (Vendedor antiguo)
  {
    path: 'seller',
    component: LayoutSeller,
    children: [
      { path: 'catalog', component: CatalogSeller },
      { path: 'catalog/product/:id', component: ProductDetailSeller },
      { path: 'profile', component: ProfileSeller }
    ]
  },

  // Inventory management routes (lazy loaded)
  {
    path: 'inventory',
    loadChildren: () => import('./pages/inventory/inventory.routes').then(m => m.INVENTORY_ROUTES)
  },

  // Fallback redirect to store home
  { path: '**', redirectTo: '' }
];