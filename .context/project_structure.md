# Project Structure

**Last updated:** 2026-05-07

---

## Directory Tree (source files only)

```
angular-inc/
├── src/
│   ├── app/
│   │   ├── app.config.ts          # Providers: zoneless, router, httpClient, mock DI swap
│   │   ├── app.html               # Root template: navbar + <router-outlet>
│   │   ├── app.routes.ts          # Root routes: '' → /users (lazy)
│   │   ├── app.scss               # Root styles (minimal)
│   │   ├── app.spec.ts            # App smoke tests
│   │   ├── app.ts                 # Root component (RouterOutlet only)
│   │   │
│   │   ├── features/
│   │   │   └── users/
│   │   │       ├── components/
│   │   │       │   ├── user-card.component.ts       # Presentational: card UI, select/delete outputs
│   │   │       │   ├── user-card.component.spec.ts  # 11 unit tests
│   │   │       │   ├── user-list.component.ts       # Container: injects store, renders cards
│   │   │       │   └── user-list.component.spec.ts  # 20 unit tests
│   │   │       ├── models/
│   │   │       │   └── user.model.ts                # User interface (id, name, email, role, isActive, createdAt)
│   │   │       ├── services/
│   │   │       │   ├── user-api.service.ts          # HttpClient: getAll, getById, create, update, delete
│   │   │       │   └── mock-user-api.service.ts     # In-memory mock with 5 seed users + 600ms delay
│   │   │       ├── state/
│   │   │       │   ├── users.store.ts               # NgRx SignalStore: state, computed, rxMethods
│   │   │       │   └── users.store.spec.ts          # 10 unit tests
│   │   │       └── users.routes.ts                  # /users → UserListComponent (lazy)
│   │   │
│   │   └── shared/
│   │       └── components/
│   │           └── data-table/
│   │               ├── data-table.component.ts      # Generic sortable table, rowClick output
│   │               └── data-table.component.spec.ts # 8 unit tests
│   │
│   ├── environments/
│   │   ├── environment.ts          # { production: false, useMock: true }
│   │   └── environment.prod.ts     # { production: true } ⚠️ missing useMock: false
│   │
│   ├── styles/
│   │   └── _variables.scss         # Bootstrap variable overrides + @import bootstrap
│   ├── styles.scss                 # Global styles entry point
│   ├── index.html                  # HTML shell
│   └── main.ts                     # bootstrapApplication(App, appConfig)
│
├── .context/                       # Project analysis (this directory)
├── .claude/                        # Claude Code settings
├── .vscode/                        # VS Code workspace config
├── angular.json                    # Angular CLI workspace config
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript base config (strict mode)
├── tsconfig.app.json               # App-specific TS config
├── tsconfig.spec.json              # Test-specific TS config
├── .prettierrc                     # Prettier formatting rules
├── .editorconfig                   # Editor formatting
├── CLAUDE.md                       # Claude Code project instructions
└── README.md
```

---

## Key Architectural Decisions

| Decision | Implementation |
|---|---|
| Zoneless | `provideZonelessChangeDetection()` in `app.config.ts` |
| State management | NgRx SignalStore (`signalStore` + `withState` + `withComputed` + `withMethods`) |
| Async effects | `rxMethod` + `tapResponse` pattern |
| Change detection | `ChangeDetectionStrategy.OnPush` on all components |
| Component authoring | Standalone (`standalone: true`), no NgModules |
| DI | `inject()` function only, no constructor injection |
| Inputs/Outputs | `input()` / `output()` signal API, no decorators |
| Styling | Bootstrap 5.3 SCSS utility classes, variable overrides |
| Testing | Vitest + Angular TestBed, real signal assertions |
| Mocking | Service swap via DI in `app.config.ts` |
| Routing | Lazy `loadChildren` / `loadComponent` everywhere |

---

## What's Missing from the Intended Structure

Based on CLAUDE.md conventions, the following directories/files are expected but not yet created:

```
src/app/features/
  auth/                          # Not started
    components/login.component.ts
    state/auth.store.ts
    services/auth-api.service.ts
    guards/auth.guard.ts
    auth.routes.ts
  users/
    components/
      user-detail.component.ts   # Not started
      user-form.component.ts     # Not started
src/app/core/
  interceptors/
    error.interceptor.ts         # Not started
src/app/shared/
  components/
    pagination/                  # Not started
    toast/                       # Not started
    not-found/                   # Not started
```
