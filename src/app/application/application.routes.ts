import { Routes } from '@angular/router';

export const routesPage: Routes = [
  {
    path: 'seguimiento',
    loadComponent: () => import('./components/seguimiento/seguimiento.component'),
  },
  {
    path: 'pendientes',
    loadComponent: () => import('./components/pendientes/pendientes.component'),
  },
  {
    path: 'emitidos',
    loadComponent: () => import('./components/emitidos/emitidos.component'),
  },
  {
    path: '',
    redirectTo: 'seguimiento',
    pathMatch: 'full',
  },
];
