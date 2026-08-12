import { Injectable } from '@angular/core';
import { Role } from '../models/role.model';

const STORAGE_KEY = 'roles';

@Injectable({ providedIn: 'root' })
export class RolesService {
  getAll(): Role[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Role[]) : [];
  }

  add(role: Role): Role[] {
    const roles = this.getAll();
    const updated = [...roles, role];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  update(role: Role): Role[] {
    const updated = this.getAll().map(r => (r.id === role.id ? role : r));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  delete(id: string): Role[] {
    const updated = this.getAll().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
}
