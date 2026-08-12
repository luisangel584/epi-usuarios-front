import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-container">
      <h3>{{ editingRole ? 'Editar rol' : 'Nuevo rol' }}</h3>
      <form (ngSubmit)="onSubmit()">
        <div class="field">
          <label for="name">Nombre</label>
          <input id="name" name="name" [(ngModel)]="name" required placeholder="Ej: Administrador" />
        </div>
        <div class="field">
          <label for="description">Descripción</label>
          <textarea id="description" name="description" [(ngModel)]="description" placeholder="Descripción del rol"></textarea>
        </div>
        <div class="actions">
          <button type="submit" [disabled]="!name.trim()">{{ editingRole ? 'Actualizar' : 'Crear' }}</button>
          <button type="button" *ngIf="editingRole" (click)="cancel.emit()">Cancelar</button>
        </div>
      </form>
    </div>
  `,
  styles: `
    .form-container { background: #f9f9f9; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; }
    h3 { margin: 0 0 1rem; }
    .field { margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.25rem; }
    label { font-weight: 500; font-size: 0.9rem; }
    input, textarea { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; width: 100%; box-sizing: border-box; }
    textarea { resize: vertical; min-height: 80px; }
    .actions { display: flex; gap: 0.5rem; }
    button { padding: 0.5rem 1.2rem; border: none; border-radius: 4px; cursor: pointer; background: #3f51b5; color: #fff; }
    button[type="button"] { background: #888; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
  `
})
export class RoleFormComponent implements OnChanges {
  @Input() editingRole: Role | null = null;
  @Output() save = new EventEmitter<Role>();
  @Output() cancel = new EventEmitter<void>();

  name = '';
  description = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingRole']) {
      this.name = this.editingRole?.name ?? '';
      this.description = this.editingRole?.description ?? '';
    }
  }

  onSubmit(): void {
    if (!this.name.trim()) return;
    const role: Role = {
      id: this.editingRole?.id ?? crypto.randomUUID(),
      name: this.name.trim(),
      description: this.description.trim(),
      createdAt: this.editingRole?.createdAt ?? new Date().toISOString(),
    };
    this.save.emit(role);
    if (!this.editingRole) {
      this.name = '';
      this.description = '';
    }
  }
}
