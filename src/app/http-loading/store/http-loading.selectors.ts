import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HttpLoadingState } from './http-loading.reducer';

export const selectHttpLoadingState = createFeatureSelector<HttpLoadingState>('httpLoading');

export const selectIsHttpLoading = createSelector(selectHttpLoadingState, state => state.loading);
