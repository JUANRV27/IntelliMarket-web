import { Routes } from '@angular/router';
import { LayoutClient } from './layouts/main-layout/layout-client';
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

export const routes: Routes = [
  // 1. MÓDULO DE AUTENTICACIÓN Y SEGURIDAD (Rutas Públicas de Ingreso)
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'register/customer', component: RegisterCustomer },
      { path: 'register/seller', component: RegisterSeller }
    ]
  },

  // Módulo compartido de perfiles básicos
  { path: 'profile', component: ProfileDetail },
  { path: 'profile/edit', component: ProfileEdit },
  
  // 2. MÓDULO PRIVADO DEL VENDEDOR (Tiene prioridad alta para interceptar /seller)
  {
    path: 'seller',
    component: LayoutSeller, 
    children: [
      { path: 'inventory', component: ListComponent },          // Tu panel operativo / bodega
      { path: 'store/create', component: StoreFormComponent },    // Formulario de StoreRequest obligatorio
      { path: 'catalog', component: CatalogSeller },            // Vistas antiguas si las necesitas
      { path: 'catalog/product/:id', component: ProductDetailSeller },
      { path: 'profile', component: ProfileSeller }
    ]
  },

  // 3. MÓDULO PÚBLICO / CLIENTE (La raíz se evalúa al final para evitar atrapar al vendedor)
  {
    path: '',
    component: LayoutClient,
    children: [
      { path: '', component: Landing },                         // Catálogo de compras general del comprador
      { path: 'reviews', component: Reviews },
      { path: 'join-as-seller', component: LandingSeller },     // Cambiado de 'seller' a 'join-as-seller' para romper el choque de rutas
      { path: 'seller/login-old', component: LoginSeller }      // Ruta de login antigua por si acaso
    ]
  },

  // Redirecciones de seguridad por defecto
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];