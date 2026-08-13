import { createReducer, on } from '@ngrx/store';
import * as HttpLoadingActions from './http-loading.actions';

export interface HttpLoadingState {
  loading: boolean;
}

export const initialState: HttpLoadingState = {
  loading: false,
};

export const httpLoadingReducer = createReducer(
  initialState,

  on(HttpLoadingActions.httpLoadingStarted, state => ({ ...state, loading: true })),
  on(HttpLoadingActions.httpLoadingFinished, state => ({ ...state, loading: false })),
);
