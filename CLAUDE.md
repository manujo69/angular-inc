# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack
- Angular 21 con standalone components y zoneless change detection (`provideZonelessChangeDetection()`)
- NgRx SignalStore (`@ngrx/signals`) para todo el estado compartido/feature
- Bootstrap 5.3 via SCSS — NO Angular Material, NO Tailwind
- RxJS para operaciones async; convertir a signals en el componente con `toSignal()`
- TypeScript strict mode
- Test runner: **Vitest** (invocado via `ng test`)

## Commands
- Dev server: `ng serve`
- Build: `ng build`
- Tests: `ng test` / test single file: `ng test --include=**/<name>*.spec.ts`
- Type check: `npx tsc --noEmit`

## Project Layout

```
src/app/
  app.config.ts          # provideZonelessChangeDetection, provideRouter, mock DI swap
  app.routes.ts          # lazy-loads feature routes via loadChildren
  features/<name>/
    components/          # contenedor + presentacionales
    state/<name>.store.ts
    services/<name>-api.service.ts
    models/<name>.model.ts
    <name>.routes.ts
  shared/
    components/          # UI genérica reutilizable (ej. DataTableComponent)
src/styles/
  _variables.scss        # Override Bootstrap vars + @import 'bootstrap/scss/bootstrap'
```

Feature routes se cargan lazy: `loadChildren: () => import('./features/users/users.routes')`.

## Angular Rules
- SIEMPRE usar standalone components (`standalone: true` en `@Component`)
- SIEMPRE usar `inject()` — nunca inyección por constructor
- SIEMPRE usar `input()` / `output()` signal API — nunca `@Input` / `@Output` decoradores
- Todos los componentes usan `changeDetection: ChangeDetectionStrategy.OnPush`
- Templates inline en el archivo `.ts` del componente — no archivos `.html` separados
- Usar bloques `@defer` para secciones de UI no críticas
- Preferir `httpResource()` para GETs simples; usar `HttpClient` directamente para mutaciones (POST/PATCH/DELETE)
- Separar componentes en dos roles:
  - **Contenedor**: inyecta el store, orquesta datos, pocos inputs. Ejemplo: `UserListComponent`
  - **Presentacional**: solo `input()`/`output()`, sin `inject()` de stores. Ejemplo: `UserCardComponent`
- Si se usa `subscribe()` fuera del store, aplicar siempre `takeUntilDestroyed()` (`@angular/core/rxjs-interop`)

## State Management (NgRx SignalStore)

Patrón canónico en `src/app/features/users/state/users.store.ts`:

```ts
export const MyStore = signalStore(
  { providedIn: 'root' },      // singleton a nivel app
  withState(initialState),
  withComputed(({ ... }) => ({ ... })),
  withMethods((store, api = inject(MyApiService)) => ({
    loadItems: rxMethod<void>(pipe(
      tap(() => patchState(store, { loading: true })),
      switchMap(() => api.getAll().pipe(
        tapResponse({ next: ..., error: ... })
      ))
    )),
  }))
);
```

- Efectos async: `rxMethod` + `tapResponse` de `@ngrx/operators`
- `patchState()` siempre — NUNCA mutar estado directamente
- Exponer solo lectura vía `asReadonly()` cuando sea necesario

## Mock Service Pattern

`environment.useMock = true` (dev) activa el swap en `app.config.ts`:
```ts
...(environment.useMock ? [{ provide: UserApiService, useClass: MockUserApiService }] : [])
```
Cada feature con API tiene un `mock-<name>-api.service.ts` paralelo al real.

## Bootstrap 5 / SCSS
- Clases utilitarias Bootstrap en templates — no CSS custom para spacing/layout
- Override de variables en `src/styles/_variables.scss` **antes** del `@import 'bootstrap/scss/bootstrap'`
- La advertencia de deprecación de `@import` de Sass es esperada (Bootstrap 5 no usa `@use` aún)
- Estilos de componente van en el `.scss` del componente usando mixins de Bootstrap

## File Naming
- Components: `user-list.component.ts`
- Stores: `users.store.ts`
- Services: `user-api.service.ts` / `mock-user-api.service.ts`
- Models: `user.model.ts`
- Routes: `users.routes.ts`

## Git
- Branch naming: `feature/<ticket>-short-description`
- Nunca hacer commit directamente a main
- Ejecutar `npx tsc --noEmit` antes de commitear

## Hard Rules
- Nunca agregar imports de `zone.js` — proyecto completamente zoneless
- Nunca usar `NgModules` — solo standalone components
- Nunca instalar paquetes npm sin confirmar con el usuario primero
