# Interview

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.10.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Archivos de environment

La configuración que cambia según el ambiente vive en `src/environments`. Por ahora solo existen dos: `environment.ts` para producción y `environment.development.ts` para desarrollo. Ambos exportan el mismo shape, hoy nada más traen `usersApiBaseUrl`, la URL base que usa `UsersService` para pegarle a la API:

```typescript
// src/environments/environment.ts (producción)
export const environment = {
  usersApiBaseUrl: 'https://dummyjson.com',
};
```

```typescript
// src/environments/environment.development.ts (desarrollo)
export const environment = {
  usersApiBaseUrl: 'https://dummyjson.com',
};
```

El código nunca importa el archivo development directamente, siempre importa `environment.ts`:

```typescript
// users.service.ts
import { environment as env } from "../../../environments/environment";
```

Quien decide cuál de los dos termina ahí es Angular CLI, a través de `fileReplacements` en `angular.json`. Cuando corres con la configuración `development` (la que usa `ng serve` por default), Angular reemplaza `environment.ts` por `environment.development.ts` antes de compilar:

```json
// angular.json, configurations.development
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.development.ts"
  }
]
```

En `production` no hay ningún `fileReplacements`, así que se queda con el `environment.ts` de siempre. Ahora mismo los dos archivos tienen el mismo valor porque la API de dummyjson es la misma en ambos casos, pero la idea de separar los environments es justo esa: el día que producción necesite apuntar a otra URL, otra API key o cualquier config distinta, solo se cambia el archivo correspondiente sin tocar el código de los componentes o servicios.

## Arquitectura del proyecto

Todo vive bajo `src/app` separado por dominio, cada quien con su carpeta: `roles`, `users`, `http-loading`, `shared`, `interceptors`. Cada feature (roles y users) trae adentro sus propios `components`, `models`, `services` y `store`. No hay NgModules, todo son standalone components, y las rutas cargan cada uno con `loadComponent` para que se descarguen solo cuando se visitan (ver `app.routes.ts`).

**El store**

Es NgRx, un feature por dominio. Cada uno trae su archivos: `*.actions.ts`, `*.reducer.ts`, `*.effects.ts` y `*.selectors.ts`. El patrón se repite igual en los tres (roles, users, httpLoading): una acción disparadora (`loadUsers`), su success y su failure, el reducer solo mueve `loading` y `error` más el dato correspondiente, y el effect hace el `switchMap` a la llamada http con su `catchError`.

```typescript
// users.actions.ts
export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction('[Users] Load Users Success', props<{ users: User[] }>());
export const loadUsersFailure = createAction('[Users] Load Users Failure', props<{ error: string }>());
```

```typescript
// users.reducer.ts
on(UsersAction.loadUsers, state => ({ ...state, loading: true, error: null })),
on(UsersAction.loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false })),
on(UsersAction.loadUsersFailure, (state, { error }) => ({ ...state, error, loading: false })),
```

```typescript
// users.effects.ts
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
```

Todo se registra junto en `app.config.ts` con `provideStore({...})` y `provideEffects([...])`, así que sumar un feature nuevo es solo agregarlo ahí:

```typescript
// app.config.ts
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
```

El `httpLoading` es un poco distinto porque no representa un recurso sino un contador global. `HttpLoadingTrackerService` lleva la cuenta de requests pendientes con un `BehaviorSubject`, el interceptor `httpLoadingInterceptor` le avisa cuando entra y cuando termina cada request, y un effect (`HttpLoadingEffects`) traduce ese observable a acciones para que viva en el store igual que todo lo demás. Así el spinner del nav (`Cargando datos...`) prende con cualquier llamada http sin que cada componente lo maneje por su cuenta.

```typescript
// http-loading-tracker.service.ts
isLoading$: Observable<boolean> = this.pendingRequests.pipe(
  map(count => count > 0),
  distinctUntilChanged()
);
```

```typescript
// http-loading.interceptor.ts
export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingTracker = inject(HttpLoadingTrackerService);
  loadingTracker.requestStarted();
  return next(req).pipe(finalize(() => loadingTracker.requestFinished()));
};
```

Lo del `currentUserLoaded` que se explica abajo sigue el mismo diseño, pero en lugar de dispararse por interacción del usuario se manda una sola vez en el `ngOnInit` del `AppComponent`, y en vez de alimentar un contador global gatea el render completo del template.

**El modal genérico**

Es `ConfirmDialogComponent`, vive en `shared/components/confirm-dialog`. No sabe nada de roles ni de usuarios, solo recibe `visible`, `title` y `message` por Input y avisa por Output cuando confirmas o cancelas.

```typescript
// confirm-dialog.component.ts
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = 'Confirmar';
  @Input() message = '¿Estás seguro?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
```

`RolesListComponent` y `UsersListComponent` lo usan de la misma forma. Cuando alguien da clic en eliminar, la lista no borra nada todavía: guarda el id de ese registro en una variable local, `pendingDeleteId`, y se la pasa al modal para que se muestre. Si la persona confirma, ahí sí se dispara el delete de verdad; si cancela, `pendingDeleteId` vuelve a quedar en `null` y no pasa nada. Gracias a esto ninguna de las dos listas repite el HTML del overlay ni el texto del componente, todo eso vive una sola vez dentro del modal:

```html
<!-- users-list.component.html, lo mismo en roles-list.component.ts -->
<app-confirm-dialog
  [visible]="pendingDeleteId !== null"
  message="¿Seguro que deseas eliminar este usuario?"
  (confirm)="confirmDelete()"
  (cancel)="cancelDelete()"
></app-confirm-dialog>
```

**Estilos**

Roles y users no siguen el mismo esquema todavía. Roles (`RolesComponent`, `RolesListComponent`, `RoleFormComponent`) trae los estilos inline dentro del decorator junto con el template:

```typescript
// roles-list.component.ts
@Component({
  selector: 'app-roles-list',
  template: `<div class="roles-list">...</div>`,
  styles: `
    .roles-list { width: 100%; }
    .btn-danger { background: #e53935; }
  `
})
```

Users en cambio usa archivos `.scss` separados con `styleUrl`, que es el patrón que sigue toda la implementación:

```typescript
// users-list.component.ts
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
```

No hay variables SCSS compartidas ni archivo de theme todavía, el azul `#3f51b5` y el rojo de peligro `#e53935` están repetidos a mano en cada componente que los necesita. El `styles.scss` global casi no tiene nada, solo el comentario que deja Angular CLI por default.

## Estado global de carga del usuario

La implementación agrega un estado global en el store de usuarios para saber si ya se cargó la info del usuario que viene de `https://dummyjson.com/users/1`. Mientras esa petición no termine, la app no muestra nada del contenido (ni el nav ni el router outlet), solo un loading a pantalla completa. Ya que termina, sea con éxito o con error, se muestra la app normal.

Esto fue lo que se tocó:

1. `UsersService`: se agregó `getById(id)`, que pega a `/users/:id`.

```typescript
// users.service.ts
getById(id: number): Observable<User> {
  return this.http.get<User>(`${this.USERS_API_BASE_URL}/users/${id}`);
}
```

2. `users.actions.ts`: se sumaron `loadCurrentUser`, `loadCurrentUserSuccess` y `loadCurrentUserFailure`.

```typescript
// users.actions.ts
export const loadCurrentUser = createAction('[Users] Load Current User');
export const loadCurrentUserSuccess = createAction('[Users] Load Current User Success', props<{ user: User }>());
export const loadCurrentUserFailure = createAction('[Users] Load Current User Failure', props<{ error: string }>());
```

3. `users.reducer.ts`: el estado de usuarios ahora también guarda `currentUser` y `currentUserLoaded`.

```typescript
// users.reducer.ts
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
```

4. `users.selectors.ts`: se agregaron `selectCurrentUser` y `selectCurrentUserLoaded`.

```typescript
// users.selectors.ts
export const selectCurrentUser = createSelector(selectUsersState, state => state.currentUser);
export const selectCurrentUserLoaded = createSelector(selectUsersState, state => state.currentUserLoaded);
```

5. `users.effects.ts`: el efecto `loadCurrentUser$` llama a `getById(1)` y despacha success o failure según cómo salga.

```typescript
// users.effects.ts
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
```

6. `AppComponent`: en el `ngOnInit` se dispara `loadCurrentUser`, y en el template todo el contenido queda envuelto en un `*ngIf` con ese selector, con un `ng template` como fallback que enseña el spinner.

```typescript
// app.component.ts
ngOnInit(): void {
  this.store.dispatch(UsersActions.loadCurrentUser());
}
```

```html
<!-- app.component.html -->
<ng-container *ngIf="currentUserLoaded$ | async; else appBootLoading">
  <nav class="app-nav">...</nav>
  <router-outlet />
</ng-container>

<ng-template #appBootLoading>
  <div class="app-boot-loading">
    <span class="app-boot-loading__spinner"></span>
    <span class="app-boot-loading__text">Cargando aplicación...</span>
  </div>
</ng-template>
```

Algo importante: `currentUserLoaded` se pone en `true` tanto si la petición sale bien como si falla, así que si el request truena no se queda la pantalla de loading pegada para siempre. El error de todos modos se guarda en el state por si más adelante se quiere mostrar algo al usuario.

## Estilos BEM en los componentes de Users

Los componentes de `users` (`UsersComponent`, `UsersListComponent`, `UserFormComponent` y `UserEditComponent`) tenían clases sueltas tipo `form-container`, `field`, `actions`, `loading`, `btn-danger`, `empty`, que en el scss se anidaban con selectores de tag (`.field label`, `.field input, select`, `table button`). Funcionaba, pero el nombre de la clase no decía a qué componente pertenecía y el estilo dependía de la jerarquía del HTML en vez de la clase misma.

Se pasaron todos a BEM: un bloque por componente, elementos con doble guion bajo y modificadores con doble guion medio.

* `UsersComponent`: bloque `users-page`, con `users-page__title`, `users-page__form` y `users-page__list`.
* `UsersListComponent`: bloque `users-list`, con `users-list__loading`, `users-list__table`, `users-list__actions`, `users-list__button` (y su variante `users-list__button--danger` para el de eliminar) y `users-list__empty`.
* `UserFormComponent`: bloque `user-form` (antes era `form-container`), con `user-form__title`, `user-form__field`, `user-form__label`, `user-form__input`, `user-form__actions` y `user-form__button` (con `user-form__button--secondary` para el botón de cancelar, que antes se distinguía con el selector `[type='button']` en vez de una clase).
* `UserEditComponent`: bloque `user-edit-page`, con `user-edit-page__title` y `user-edit-page__status` (antes era `.loading`, se renombró porque en realidad marca el estado de "no encontrado", no solo carga).

El caso más claro es `UserFormComponent`, que era el que más dependía de selectores de tag. Antes:

```html
<div class="form-container">
  <div class="field">
    <label for="firstName">Nombre</label>
    <input id="firstName" name="firstName" [(ngModel)]="firstName" />
  </div>
  <div class="actions">
    <button type="submit">Crear</button>
    <button type="button" (click)="cancel.emit()">Cancelar</button>
  </div>
</div>
```

```scss
.form-container {
  .field {
    label { font-weight: 500; }
    input, select { padding: 0.5rem; }
  }
  .actions button {
    &[type='button'] { background: #888; }
  }
}
```

Después:

```html
<div class="user-form">
  <div class="user-form__field">
    <label class="user-form__label" for="firstName">Nombre</label>
    <input class="user-form__input" id="firstName" name="firstName" [(ngModel)]="firstName" />
  </div>
  <div class="user-form__actions">
    <button class="user-form__button" type="submit">Crear</button>
    <button class="user-form__button user-form__button--secondary" type="button" (click)="cancel.emit()">Cancelar</button>
  </div>
</div>
```

```scss
.user-form {
  &__label { font-weight: 500; }
  &__input { padding: 0.5rem; }
  &__button {
    &--secondary { background: #888; }
  }
}
```

Con esto cada scss quedó plano, casi todo resuelto con `&__elemento` y `&--modificador` dentro del bloque, sin depender de selectores de tag ni de la posición del elemento en el HTML. El comportamiento visual no cambió en nada, fue puro renombre de clases y ajuste del scss para que matchee.

## Sistema de diseño con variables de Sass

Los valores de color y espaciado que antes estaban repetidos a mano en cada componente (el `#3f51b5`, el `#e53935`, los `0.5rem` y `1.5rem` sueltos) ahora viven en un solo lugar: `src/styles/_variables.scss`. Es un partial de Sass con variables de color, espaciado, bordes y layout.

```scss
// src/styles/_variables.scss

// Colores
$color-primary: #3f51b5;
$color-danger: #e53935;
$color-secondary: #888;
$color-white: #fff;

$color-surface: #f9f9f9;
$color-surface-muted: #f5f5f5;

$color-border: #ddd;
$color-border-light: #ccc;

$color-text-muted: #888;
$color-text-faint: #aaa;
$color-text-body: #555;

// Espaciado
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;

// Bordes
$radius-sm: 4px;
$radius-md: 8px;
```

Para poder importarlo desde cualquier componente sin escribir rutas relativas larguísimas tipo `../../../../styles/variables`, se agregó `src/styles` como `includePath` de Sass en `angular.json` (tanto en `build` como en `test`):

```json
"stylePreprocessorOptions": {
  "includePaths": ["src/styles"]
}
```

Así, cualquier `.scss` de la implementación importa el archivo con `@use 'variables' as *;`. El `as *` trae las variables sin namespace, así que se usan directo como `$color-primary`, sin prefijo:

```scss
// users-list.component.scss
@use 'variables' as *;

.users-list {
  &__button {
    padding: 0.3rem 0.7rem;
    border-radius: $radius-sm;
    background: $color-primary;
    color: $color-white;

    &--danger {
      background: $color-danger;
    }
  }
}
```

Por ahora las variables se usan en toda la implementación de `users` (`users.component.scss`, `users-list.component.scss`, `user-form.component.scss`, `user-edit.component.scss`) y en el modal genérico `confirm-dialog.component.scss`. El resultado visual es idéntico al de antes, el cambio es que ahora si se necesita ajustar el azul primario o el espaciado base, se hace en un solo archivo y se propaga a todos los componentes que lo usan.
