import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="roles-list">
      <div *ngIf="loading" class="loading">Cargando roles...</div>

      <table *ngIf="!loading">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Fecha de creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let role of roles">
            <td>{{ role.name }}</td>
            <td>{{ role.description }}</td>
            <td>{{ role.createdAt | date:'short' }}</td>
            <td>
              <button (click)="edit.emit(role)">Editar</button>
              <button (click)="delete.emit(role.id)" class="btn-danger">Eliminar</button>
            </td>
          </tr>
          <tr *ngIf="roles.length === 0">
            <td colspan="4" class="empty">No hay roles registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .roles-list { width: 100%; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem 1rem; border-bottom: 1px solid #ddd; text-align: left; }
    th { background: #f5f5f5; font-weight: 600; }
    button { margin-right: 0.5rem; padding: 0.3rem 0.7rem; cursor: pointer; border: none; border-radius: 4px; background: #3f51b5; color: #fff; }
    .btn-danger { background: #e53935; }
    .loading { padding: 1rem; color: #888; }
    .empty { text-align: center; color: #aaa; }
  `
})
export class RolesListComponent {
  @Input() roles: Role[] = [];
  @Input() loading = false;
  @Output() edit = new EventEmitter<Role>();
  @Output() delete = new EventEmitter<string>();
}
