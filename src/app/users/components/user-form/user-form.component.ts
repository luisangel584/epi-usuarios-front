import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Role } from '../../../roles/models/role.model';
import * as RolesActions from '../../../roles/store/roles.actions';
import { selectAllRoles } from '../../../roles/store/roles.selectors';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [NgIf, NgForOf, AsyncPipe, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnChanges, OnInit {
  @Input() editingUser: User | null = null;
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  roles$: Observable<Role[]>;

  firstName = '';
  lastName = '';
  age = 0;
  email = '';
  city = '';
  roleId = '';

  constructor(private store: Store) {
    this.roles$ = this.store.select(selectAllRoles);
  }

  ngOnInit(): void {
    this.store.dispatch(RolesActions.loadRoles());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingUser']) {
      this.firstName = this.editingUser?.firstName ?? '';
      this.lastName = this.editingUser?.lastName ?? '';
      this.age = this.editingUser?.age ?? 0;
      this.email = this.editingUser?.email ?? '';
      this.city = this.editingUser?.city ?? '';
      this.roleId = this.editingUser?.roleId ?? '';
    }
  }

  onSubmit(): void {
    if (!this.firstName.trim() || !this.lastName.trim()) return;

    const user: User = {
      id: this.editingUser?.id ?? 0,
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      age: this.age,
      email: this.email.trim(),
      city: this.city.trim(),
      createdAt: this.editingUser?.createdAt ?? new Date().toISOString(),
      roleId: this.roleId || undefined,
    };

    this.save.emit(user);

    if (!this.editingUser) {
      this.firstName = '';
      this.lastName = '';
      this.age = 0;
      this.email = '';
      this.city = '';
      this.roleId = '';
    }
  }
}
