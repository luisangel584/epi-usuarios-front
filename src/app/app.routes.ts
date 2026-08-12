import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'roles', loadComponent: () => import('./roles/roles.component').then(m => m.RolesComponent) },
  {
    path: 'users',
    // loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
  },
  { path: '', redirectTo: 'roles', pathMatch: 'full' },
];
