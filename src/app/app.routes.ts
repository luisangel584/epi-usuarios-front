import { Routes } from '@angular/router';
import { userEditGuard } from './users/guards/user-edit.guard';

export const routes: Routes = [
  { path: 'roles', loadComponent: () => import('./roles/roles.component').then(m => m.RolesComponent) },
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
  },
  {
    path: 'users/:id/edit',
    canActivate: [userEditGuard],
    loadComponent: () => import('./users/user-edit/user-edit.component').then(m => m.UserEditComponent),
  },
  { path: '', redirectTo: 'roles', pathMatch: 'full' },
];
