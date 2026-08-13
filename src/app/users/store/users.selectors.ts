import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UsersState } from "./users.reducer";

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(selectUsersState, state => state.users);
export const selectUsersLoading = createSelector(selectUsersState, state => state.loading);
export const selectUsersError = createSelector(selectUsersState, state => state.error);

export const selectUserById = (id: number) =>
  createSelector(selectAllUsers, users => users.find(user => user.id === id));

export const selectCurrentUser = createSelector(selectUsersState, state => state.currentUser);
export const selectCurrentUserLoaded = createSelector(selectUsersState, state => state.currentUserLoaded);
