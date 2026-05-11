# Feature Checklist

**Last updated:** 2026-05-07

---

## Core Infrastructure

- [x] Angular 21 standalone components with zoneless change detection (`provideZonelessChangeDetection`) — **100%**
- [x] NgRx SignalStore wired as singleton, canonical `rxMethod` + `tapResponse` pattern — **100%**
- [x] Bootstrap 5.3 via SCSS with variable overrides — **100%**
- [x] Lazy-loaded feature routing — **100%**
- [x] Mock service swap via `environment.useMock` — **100%**
- [x] Vitest test runner configured — **100%**
- [ ] Bootstrap Icons package installed — **0%** *(classes used in DataTableComponent but package missing)*
- [ ] Inter font loaded (referenced in `_variables.scss` but never imported) — **0%**

---

## Users Feature

### Data Layer
- [x] `User` model interface (id, name, email, role, isActive, createdAt) — **100%**
- [x] `UserApiService` — CRUD: `getAll`, `getById`, `create`, `update`, `delete` — **100%**
- [x] `MockUserApiService` — all methods with simulated delay — **80%** *(mutations don't persist to in-memory array)*

### State (NgRx SignalStore)
- [x] `UsersStore` — state: users, selectedUserId, loading, error — **100%**
- [x] Computed: `selectedUser`, `totalUsers`, `activeUsers` — **100%**
- [x] `loadUsers` (rxMethod, switchMap) — **100%**
- [x] `selectUser` / `clearSelection` — **100%**
- [x] `deleteUser` (rxMethod) — **90%** *(missing loading state during delete)*
- [ ] `createUser` store method — **0%**
- [ ] `updateUser` store method — **0%**

### Components
- [x] `UserListComponent` (container) — displays cards, loading, error, empty state — **100%**
- [x] `UserCardComponent` (presentational) — name, email, role, active badge, select, delete — **100%**
- [ ] `UserDetailComponent` — user profile/detail view — **0%**
- [ ] `UserFormComponent` — create/edit form — **0%**
- [ ] Search/filter UI — **0%**
- [ ] Pagination — **0%**

### Routing
- [x] `/users` → `UserListComponent` — **100%**
- [ ] `/users/:id` → `UserDetailComponent` — **0%**
- [ ] `/users/new` → `UserFormComponent` — **0%**

---

## Shared Components

- [x] `DataTableComponent` — sortable table, `rowClick` output, empty state — **100%**
- [ ] `DataTableComponent` wired into Users feature — **0%**
- [ ] Pagination component — **0%**
- [ ] Modal/dialog component — **0%**
- [ ] Toast/notification component — **0%**
- [ ] Breadcrumb component — **0%**

---

## Authentication Feature

- [ ] Login page/component — **0%**
- [ ] Auth store — **0%**
- [ ] Auth guard for protected routes — **0%**
- [ ] HTTP interceptor for auth tokens — **0%**
- [ ] Mock auth service — **0%**

---

## Cross-Cutting Concerns

- [ ] Global HTTP error interceptor — **0%**
- [ ] Loading spinner / global loading state — **0%** *(only per-feature)*
- [ ] 404 / Not Found page — **0%**
- [ ] App-level error boundary — **0%**

---

## Testing

- [x] `UsersStore` unit tests (10 cases) — **100%**
- [x] `UserListComponent` unit tests (20 cases) — **100%**
- [x] `UserCardComponent` unit tests (11 cases) — **100%**
- [x] `DataTableComponent` unit tests (8 cases) — **100%**
- [x] `App` unit tests (3 cases) — **100%**
- [ ] E2E tests — **0%**

---

## DevOps / Quality

- [ ] CI/CD pipeline (GitHub Actions or similar) — **0%**
- [ ] Production environment configuration — **0%** *(prod env file exists but `useMock` not set to false explicitly)*
- [ ] Linting configuration (ESLint) — **0%**
- [ ] Prettier configured — **100%** *(`.prettierrc` present)*
- [ ] TypeScript strict mode — **100%**
