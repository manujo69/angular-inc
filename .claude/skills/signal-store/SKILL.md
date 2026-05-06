# NgRx Signal Store Patterns

Usa este skill cuando crees o modifiques NgRx Signal Stores.

## Standard Store Template

```typescript
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';

interface <Feature>State {
  items: <Model>[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: <Feature>State = { items: [], selectedId: null, loading: false, error: null };

export const <Feature>Store = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ items, selectedId }) => ({
    selectedItem: computed(() => items().find(i => i.id === selectedId()) ?? null),
    totalItems: computed(() => items().length),
  })),
  withMethods((store, api = inject(<Feature>ApiService)) => ({
    load<Feature>s: rxMethod<void>(pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap(() => api.getAll().pipe(
        tapResponse({
          next: (items) => patchState(store, { items, loading: false }),
          error: (err: Error) => patchState(store, { error: err.message, loading: false }),
        })
      ))
    )),
  }))
);
```

## Naming Conventions
- Store file: `<feature>.store.ts`
- Store export: `<Feature>Store`
- `{ providedIn: 'root' }` para stores app-wide
- Omitir `providedIn` para stores con scope de componente

## Rules
- NUNCA mutar el estado directamente — siempre usar `patchState()`
- Efectos async van dentro de `withMethods` usando `rxMethod`
- Señales computadas van en `withComputed`
- Acceder al estado dentro de métodos como `store.users()` (invocar como función)
