# Identified Issues and Areas for Improvement

**Last updated:** 2026-05-07

---

## Bugs

### BUG-001 — Bootstrap Icons package not installed
**Severity:** High  
**File:** [src/app/shared/components/data-table/data-table.component.ts](../src/app/shared/components/data-table/data-table.component.ts#L36-L40)  
**Description:** `DataTableComponent` uses `bi bi-arrow-up`, `bi-arrow-down`, and `bi-arrow-down-up` CSS classes for sort indicators. The `bootstrap-icons` npm package is not listed in `package.json`. The sort icon `<i>` elements will render as blank/invisible in the browser.  
**Fix:** `npm install bootstrap-icons` and add `@import 'bootstrap-icons/font/bootstrap-icons'` to `src/styles.scss`.

---

### BUG-002 — Mock service mutations don't persist to in-memory state
**Severity:** Medium  
**File:** [src/app/features/users/services/mock-user-api.service.ts](../src/app/features/users/services/mock-user-api.service.ts#L65-L83)  
**Description:** `MockUserApiService.create()`, `update()`, and `delete()` return correct responses but never mutate the `MOCK_USERS` array. If `loadUsers()` is called after a delete, the deleted user reappears. The mock doesn't simulate real persistence.  
**Fix:** Make `MOCK_USERS` a `let` (or class field array), and mutate it in `create`, `update`, and `delete`.

---

### BUG-003 — Inter font referenced but never loaded
**Severity:** Low  
**File:** [src/styles/_variables.scss](../src/styles/_variables.scss#L9)  
**Description:** `$font-family-base` is set to `'Inter', system-ui, sans-serif` but the Inter font is never imported from a CDN or local files. The browser silently falls back to `system-ui`. The custom font is effectively unused.  
**Fix:** Add a Google Fonts `@import` in `src/styles.scss` or install `fontsource-inter` and import locally.

---

### BUG-004 — `deleteUser` store method has no loading indicator
**Severity:** Low  
**File:** [src/app/features/users/state/users.store.ts](../src/app/features/users/state/users.store.ts#L63-L77)  
**Description:** `loadUsers` correctly sets `loading: true` before the request, but `deleteUser` does not. During a delete operation, there's no visual feedback and the UI remains interactive.  
**Fix:** Add `tap(() => patchState(store, { loading: true }))` at the start of the `deleteUser` pipe.

---

## Code Smells

### SMELL-001 — `UserApiService` methods `create`, `update`, `getById` are dead code
**Severity:** Low  
**File:** [src/app/features/users/services/user-api.service.ts](../src/app/features/users/services/user-api.service.ts#L14-L28)  
**Description:** `getById`, `create`, and `update` are implemented in the service but have no corresponding store methods and are never called. They add surface area without functionality.  
**Resolution:** Either implement the missing store methods (`createUser`, `updateUser`) to consume these, or remove them until needed.

---

### SMELL-002 — `DataTableComponent` built but not wired into any feature
**Severity:** Low  
**File:** [src/app/shared/components/data-table/data-table.component.ts](../src/app/shared/components/data-table/data-table.component.ts)  
**Description:** `DataTableComponent` is a well-implemented, tested shared component but is imported nowhere in the actual application. It's entirely unused in production code.  
**Resolution:** Integrate into `UserListComponent` or another feature, or document it as a future shared utility.

---

### SMELL-003 — `UserListComponent` uses `implements OnInit` without strict necessity
**Severity:** Cosmetic  
**File:** [src/app/features/users/components/user-list.component.ts](../src/app/features/users/components/user-list.component.ts#L1)  
**Description:** `UserListComponent` imports `OnInit` from `@angular/core` and `implements OnInit`, but `ngOnInit()` simply calls `this.store.loadUsers()`. Since the store is a singleton, calling `loadUsers()` in `afterNextRender` or via a constructor effect would be more idiomatic for zoneless components. Not a critical issue.

---

## Missing Features (as Issues)

### MISS-001 — No user detail view
There is no `/users/:id` route or detail component. The `selectUser` store action sets `selectedUserId` but no view consumes it beyond the card highlight.

### MISS-002 — No create/edit user UI
`UserApiService` exposes `create` and `update`, but no form component or modal exists. There's no way to add or edit users from the UI.

### MISS-003 — No authentication
No login page, auth guard, or HTTP interceptor. All routes are publicly accessible.

### MISS-004 — No global error handling
HTTP errors outside the store's `tapResponse` boundary (e.g., 401 Unauthorized, network failure at app level) are silently swallowed. No global HTTP interceptor or error boundary exists.

### MISS-005 — No 404 page
No wildcard route or Not Found component is defined in `app.routes.ts`.

### MISS-006 — No ESLint configuration
`.editorconfig` and `.prettierrc` are present, but there is no `eslint.config.*` file. Angular's recommended linting setup (`@angular-eslint`) is not configured.

### MISS-007 — No CI/CD pipeline
No GitHub Actions workflows, Dockerfile, or deployment scripts. Builds must be triggered manually.

### MISS-008 — Production environment incomplete
`src/environments/environment.prod.ts` exists but does not set `useMock: false` (the property isn't present). If `useMock` is undefined, the mock swap in `app.config.ts` may behave unexpectedly.

---

## Test Coverage Gaps

### TEST-001 — 3 uncovered branches in `DataTableComponent`
The sort icon conditional `[class.bi-arrow-up]` / `[class.bi-arrow-down]` / `[class.bi-arrow-down-up]` has 3 branches not fully exercised by the existing test suite. These correspond to the intermediate "first click changes direction" state transitions.

### TEST-002 — No tests for `MockUserApiService`
`MockUserApiService` has no dedicated spec file. Its `getById`, `create`, `update`, and `delete` error paths are untested.

### TEST-003 — No E2E tests
No Playwright or Cypress configuration. Critical user journeys (load users, delete user) are only validated at unit level.
