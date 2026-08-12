import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RolesService } from '../services/roles.service';
import * as RolesActions from './roles.actions';

@Injectable()
export class RolesEffects {
  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadRoles),
      switchMap(() => {
        try {
          const roles = this.rolesService.getAll();
          return of(RolesActions.loadRolesSuccess({ roles }));
        } catch {
          return of(RolesActions.loadRolesFailure({ error: 'Error al cargar roles' }));
        }
      })
    )
  );

  addRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.addRole),
      map(({ role }) => {
        const roles = this.rolesService.add(role);
        return RolesActions.addRoleSuccess({ roles });
      })
    )
  );

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.updateRole),
      map(({ role }) => {
        const roles = this.rolesService.update(role);
        return RolesActions.updateRoleSuccess({ roles });
      })
    )
  );

  deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.deleteRole),
      map(({ id }) => {
        const roles = this.rolesService.delete(id);
        return RolesActions.deleteRoleSuccess({ roles });
      })
    )
  );

  constructor(private actions$: Actions, private rolesService: RolesService) {}
}
