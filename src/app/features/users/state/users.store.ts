import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { UserApiService } from '../services/user-api.service';
import { User } from '../models/user.model';

interface UsersState {
  users: User[];
  selectedUserId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  selectedUserId: null,
  loading: false,
  error: null,
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ users, selectedUserId }) => ({
    selectedUser: computed(() =>
      users().find((u) => u.id === selectedUserId()) ?? null
    ),
    totalUsers: computed(() => users().length),
    activeUsers: computed(() => users().filter((u) => u.isActive)),
  })),
  withMethods((store, userApi = inject(UserApiService)) => ({
    selectUser(userId: string): void {
      patchState(store, { selectedUserId: userId });
    },

    clearSelection(): void {
      patchState(store, { selectedUserId: null });
    },

    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          userApi.getAll().pipe(
            tapResponse({
              next: (users) => patchState(store, { users, loading: false }),
              error: (err: Error) =>
                patchState(store, { error: err.message, loading: false }),
            })
          )
        )
      )
    ),

    deleteUser: rxMethod<string>(
      pipe(
        switchMap((userId) =>
          userApi.delete(userId).pipe(
            tapResponse({
              next: () =>
                patchState(store, (state) => ({
                  users: state.users.filter((u) => u.id !== userId),
                })),
              error: (err: Error) => patchState(store, { error: err.message }),
            })
          )
        )
      )
    ),
  }))
);
