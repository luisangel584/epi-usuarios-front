import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from "@angular/common/http";

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { rolesReducer } from './roles/store/roles.reducer';
import { usersReducer } from "./users/store/users.reducer";
import { RolesEffects } from './roles/store/roles.effects';
import { UsersEffects } from "./users/store/users.effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      roles: rolesReducer,
      users: usersReducer
    }),
    provideEffects([
      RolesEffects,
      UsersEffects
    ]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideHttpClient(),
  ]
};
