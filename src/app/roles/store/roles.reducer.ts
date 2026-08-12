import { createReducer, on } from '@ngrx/store';
import { Role } from '../models/role.model';
import * as RolesActions from './roles.actions';

export interface RolesState {
  roles: Role[];
  loading: boolean;
  error: string | null;
}

export const initialState: RolesState = {
  roles: [],
  loading: false,
  error: null,
};

export const rolesReducer = createReducer(
  initialState,

  on(RolesActions.loadRoles, state => ({ ...state, loading: true, error: null })),
  on(RolesActions.loadRolesSuccess, (state, { roles }) => ({ ...state, roles, loading: false })),
  on(RolesActions.loadRolesFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(RolesActions.addRole, state => ({ ...state, loading: true })),
  on(RolesActions.addRoleSuccess, (state, { roles }) => ({ ...state, roles, loading: false })),

  on(RolesActions.updateRole, state => ({ ...state, loading: true })),
  on(RolesActions.updateRoleSuccess, (state, { roles }) => ({ ...state, roles, loading: false })),

  on(RolesActions.deleteRole, state => ({ ...state, loading: true })),
  on(RolesActions.deleteRoleSuccess, (state, { roles }) => ({ ...state, roles, loading: false })),
);
