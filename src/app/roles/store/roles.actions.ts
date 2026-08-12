import { createAction, props } from '@ngrx/store';
import { Role } from '../models/role.model';

// Load
export const loadRoles = createAction('[Roles] Load Roles');
export const loadRolesSuccess = createAction('[Roles] Load Roles Success', props<{ roles: Role[] }>());
export const loadRolesFailure = createAction('[Roles] Load Roles Failure', props<{ error: string }>());

// Create
export const addRole = createAction('[Roles] Add Role', props<{ role: Role }>());
export const addRoleSuccess = createAction('[Roles] Add Role Success', props<{ roles: Role[] }>());

// Update
export const updateRole = createAction('[Roles] Update Role', props<{ role: Role }>());
export const updateRoleSuccess = createAction('[Roles] Update Role Success', props<{ roles: Role[] }>());

// Delete
export const deleteRole = createAction('[Roles] Delete Role', props<{ id: string }>());
export const deleteRoleSuccess = createAction('[Roles] Delete Role Success', props<{ roles: Role[] }>());
