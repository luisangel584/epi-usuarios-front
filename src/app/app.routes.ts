import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'roles', loadComponent: () => import('./roles/roles.component').then(m => m.RolesComponent) },
  { path: '', redirectTo: 'roles', pathMatch: 'full' },
];
