# Recommendations

**Last updated:** 2026-05-07

---

## Priority 1 — Fix Bugs Before Adding Features

These are quick wins that fix broken behavior in the current implementation.

### 1. Install Bootstrap Icons
```bash
npm install bootstrap-icons
```
Then in `src/styles.scss`:
```scss
@import 'bootstrap-icons/font/bootstrap-icons';
```
This unblocks `DataTableComponent`'s sort icon UI.

### 2. Fix `MockUserApiService` in-memory persistence
Change `MOCK_USERS` from a `const` to a mutable module-level `let` array and update `create`, `update`, and `delete` to mutate it. This makes the mock correctly simulate a stateful backend during development.

### 3. Fix production environment
Add `useMock: false` to `src/environments/environment.prod.ts` explicitly, so production builds don't accidentally swap in the mock service if the property is ever evaluated as `undefined`.

### 4. Load Inter font
Add to `src/index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## Priority 2 — Complete the Users Feature

Build on what exists rather than starting new features.

### 5. Add `createUser` and `updateUser` to the store
`UserApiService` already has `create` and `update`. Add corresponding `rxMethod` entries to `UsersStore` following the same `tap → switchMap → tapResponse` pattern as `loadUsers`.

### 6. Add `UserFormComponent`
A standalone, presentational form component that emits `save` and `cancel` outputs. Used for both create and edit flows (driven by whether a `userId` input is provided). Use Angular's reactive forms with signal inputs.

### 7. Add `UserDetailComponent`
A container component at route `/users/:id` that reads `ActivatedRoute` params via `inject(ActivatedRoute)`, calls `store.loadUser(id)`, and displays a detail card. Wire `selectUser` to navigate to this route.

### 8. Add search/filter computed signal
Add a `filterQuery` signal to the store and a `filteredUsers` computed that filters `users()` by name/email. Add a text input in `UserListComponent`.

### 9. Wire `DataTableComponent` into Users
Replace or supplement the card grid with `DataTableComponent` as an optional table view. Toggle between card and table layouts with a view-mode signal.

---

## Priority 3 — Cross-Cutting Infrastructure

### 10. Global HTTP error interceptor
Create `src/app/core/interceptors/error.interceptor.ts` using `HttpInterceptorFn`. Map 401 responses to an auth redirect; map 5xx to a toast notification. Register in `app.config.ts` via `withInterceptors([errorInterceptor])`.

### 11. Add a 404 route
In `app.routes.ts`:
```ts
{ path: '**', loadComponent: () => import('./shared/components/not-found/not-found.component') }
```

### 12. Add ESLint
```bash
ng add @angular-eslint/schematics
```
Configure rules for standalone-only, no NgModules, signal API enforcement.

### 13. Add a CI/CD pipeline
Create `.github/workflows/ci.yml` with steps: `npm ci`, `npx tsc --noEmit`, `ng test --watch=false --coverage`, `ng build`. Run on every push and PR.

---

## Priority 4 — Authentication Feature

### 14. Auth feature scaffold
```
src/app/features/auth/
  components/login.component.ts
  state/auth.store.ts
  services/auth-api.service.ts / mock-auth-api.service.ts
  models/auth.model.ts
  auth.routes.ts
  guards/auth.guard.ts
```
Use `CanActivateFn` to protect user routes. Store the auth token in the `AuthStore` and inject it via the HTTP interceptor.

---

## Priority 5 — Polish and E2E Tests

### 15. Add E2E tests with Playwright
```bash
npm init playwright@latest
```
Cover: load users list, click a user card (selection), delete a user, see empty state.

### 16. Add `deleteUser` loading state
One-line fix in the store: add `tap(() => patchState(store, { loading: true }))` at the top of the `deleteUser` pipe.

### 17. Cover remaining 3 branches in DataTableComponent tests
Add a test case that clicks the sort header three times (asc → desc → new column) to exercise all sort icon class branches.
