import { User } from "../models/user.model";
import { createReducer, on } from "@ngrx/store";

import * as UsersAction from "./users.actions";

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  currentUser: User | null;
  currentUserLoaded: boolean;
}

export const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  currentUser: null,
  currentUserLoaded: false,
};

export const usersReducer = createReducer(
  initialState,

  on(UsersAction.loadUsers, state => ({ ...state, loading: true, error: null })),
  on(UsersAction.loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false })),
  on(UsersAction.loadUsersFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(UsersAction.addUser, state => ({ ...state, loading: true })),
  on(UsersAction.addUserSuccess, (state, { user }) => ({ ...state, users: [...state.users, user], loading: false })),
  on(UsersAction.addUserFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(UsersAction.updateUser, state => ({ ...state, loading: true })),
  on(UsersAction.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    loading: false
  })),
  on(UsersAction.updateUserFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(UsersAction.deleteUser, state => ({ ...state, loading: true })),
  on(UsersAction.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter(u => u.id !== id),
    loading: false
  })),
  on(UsersAction.deleteUserFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(UsersAction.loadCurrentUser, state => ({ ...state, error: null })),
  on(UsersAction.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    currentUserLoaded: true,
  })),
  on(UsersAction.loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    error,
    currentUserLoaded: true,
  })),
);
