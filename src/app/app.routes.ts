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

export const routes: Routes = [
  // Client storefront routes
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
  
  // Seller authenticated portal routes
  {
    path: 'seller',
    component: LayoutSeller,
    children: [
      { path: 'catalog', component: CatalogSeller },
      { path: 'catalog/product/:id', component: ProductDetailSeller },
      { path: 'profile', component: ProfileSeller },
      
      { 
        path: 'suppliers', 
        title: 'Mis Proveedores - IntelliMarket',
        loadComponent: () => import('./pages/seller/suppliers-seller/suppliers-seller').then(m => m.SuppliersSeller) 
      }
    ]
  },

  // Fallback redirect to store home
  { path: '**', redirectTo: '' }
];
