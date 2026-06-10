import { Routes } from '@angular/router';
export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    title: 'Inventario - IntelliMarket',
    loadComponent: () => import('./list/list').then(m => m.ListComponent)
  },
  {
    path: 'new',
    title: 'Registrar Producto - IntelliMarket',
    loadComponent: () => import('./form/form').then(m => m.FormComponent)
  },
  {
    path: 'edit/:productId',
    title: 'Editar Producto - IntelliMarket',
    loadComponent: () => import('./form/form').then(m => m.FormComponent)
  }
];