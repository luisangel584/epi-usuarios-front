import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from './models/user.model';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import * as UsersActions from './store/users.actions';
import { selectAllUsers, selectUsersLoading } from './store/users.selectors';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe, UsersListComponent, UserFormComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store, private router: Router) {
    this.users$ = this.store.select(selectAllUsers);
    this.loading$ = this.store.select(selectUsersLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());
  }

  onSave(user: User): void {
    this.store.dispatch(UsersActions.addUser({ user }));
  }

  onEdit(user: User): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }

  onDelete(id: number): void {
    this.store.dispatch(UsersActions.deleteUser({ id }));
  }
}
