import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as UsersActions from "./users.actions";
import { of } from "rxjs";
import { UsersService } from "../services/users.service";
import { catchError, map, switchMap } from "rxjs/operators";

@Injectable()
export class UsersEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        this.usersService.getAll().pipe(
          map(users => UsersActions.loadUsersSuccess({ users })),
          catchError(error => of(UsersActions.loadUsersFailure({ error: error.message })))
        )
      )
    )
  );

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.addUser),
      switchMap(({ user }) =>
        this.usersService.add(user).pipe(
          map(createUser => UsersActions.addUserSuccess({ user: createUser })),
          catchError(error => of(UsersActions.addUserFailure({ error: error.message })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      switchMap(({ user }) =>
        this.usersService.update(user).pipe(
          map(updatedUser => UsersActions.updateUserSuccess({ user: updatedUser })),
          catchError(error => of(UsersActions.updateUserFailure({ error: error.message })))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      switchMap(({ id }) =>
        this.usersService.delete(id).pipe(
          map(() => UsersActions.deleteUserSuccess({ id })),
          catchError(error => of(UsersActions.deleteUserFailure({ error: error.message })))
        )
      )
    )
  );

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadCurrentUser),
      switchMap(() =>
        this.usersService.getById(1).pipe(
          map(user => UsersActions.loadCurrentUserSuccess({ user })),
          catchError(error => of(UsersActions.loadCurrentUserFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private usersService: UsersService) {}
}
