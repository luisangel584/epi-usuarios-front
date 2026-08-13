import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserFormComponent } from '../components/user-form/user-form.component';
import * as UsersActions from '../store/users.actions';
import { selectUserById } from '../store/users.selectors';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [AsyncPipe, NgIf, UserFormComponent],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit {
  user$: Observable<User | undefined>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.user$ = this.store.select(selectUserById(id));
  }

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());
  }

  onSave(user: User): void {
    this.store.dispatch(UsersActions.updateUser({ user }));
    this.router.navigate(['/users']);
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
