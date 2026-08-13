import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from "@angular/common/http";

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { rolesReducer } from './roles/store/roles.reducer';
import { usersReducer } from "./users/store/users.reducer";
import { httpLoadingReducer } from './http-loading/store/http-loading.reducer';
import { RolesEffects } from './roles/store/roles.effects';
import { UsersEffects } from "./users/store/users.effects";
import { HttpLoadingEffects } from './http-loading/store/http-loading.effects';

import { erpAppInterceptor } from './interceptors/erp-app.interceptor';
import { httpLoadingInterceptor } from './interceptors/http-loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      roles: rolesReducer,
      users: usersReducer,
      httpLoading: httpLoadingReducer,
    }),
    provideEffects([
      RolesEffects,
      UsersEffects,
      HttpLoadingEffects,
    ]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideHttpClient(
      withInterceptors([
        erpAppInterceptor,
        httpLoadingInterceptor
      ])),
  ]
};
