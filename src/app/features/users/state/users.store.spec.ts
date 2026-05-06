import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UsersStore } from './users.store';
import { UserApiService } from '../services/user-api.service';
import { User } from '../models/user.model';

const mockUsers: User[] = [
  { id: '1', name: 'Alice', email: 'alice@test.com', role: 'admin', isActive: true, createdAt: '' },
  { id: '2', name: 'Bob', email: 'bob@test.com', role: 'viewer', isActive: false, createdAt: '' },
];

describe('UsersStore', () => {
  let store: InstanceType<typeof UsersStore>;
  let api: { getAll: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    api = {
      getAll: vi.fn().mockReturnValue(of(mockUsers)),
      delete: vi.fn().mockReturnValue(of(undefined)),
    };

    TestBed.configureTestingModule({
      providers: [
        UsersStore,
        { provide: UserApiService, useValue: api },
      ],
    });

    store = TestBed.inject(UsersStore);
  });

  it('should initialize with empty state', () => {
    expect(store.users()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.selectedUserId()).toBeNull();
  });

  describe('loadUsers', () => {
    it('should populate users on success', () => {
      store.loadUsers();
      expect(store.users()).toEqual(mockUsers);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should set error on failure', () => {
      api.getAll.mockReturnValue(throwError(() => new Error('API down')));
      store.loadUsers();
      expect(store.error()).toBe('API down');
      expect(store.loading()).toBe(false);
      expect(store.users()).toEqual([]);
    });
  });

  describe('selectUser / clearSelection', () => {
    it('should set selectedUserId', () => {
      store.selectUser('1');
      expect(store.selectedUserId()).toBe('1');
    });

    it('should clear selectedUserId', () => {
      store.selectUser('1');
      store.clearSelection();
      expect(store.selectedUserId()).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should remove the user from state after successful delete', () => {
      store.loadUsers();
      store.deleteUser('1');
      expect(store.users().find((u) => u.id === '1')).toBeUndefined();
      expect(store.users().length).toBe(1);
    });

    it('should set error on delete failure', () => {
      store.loadUsers();
      api.delete.mockReturnValue(throwError(() => new Error('Delete failed')));
      store.deleteUser('1');
      expect(store.error()).toBe('Delete failed');
      expect(store.users().length).toBe(2);
    });
  });

  describe('computed signals', () => {
    beforeEach(() => store.loadUsers());

    it('totalUsers should reflect users array length', () => {
      expect(store.totalUsers()).toBe(2);
    });

    it('activeUsers should return only active users', () => {
      expect(store.activeUsers().length).toBe(1);
      expect(store.activeUsers()[0].id).toBe('1');
    });

    it('selectedUser should return the selected user object', () => {
      store.selectUser('2');
      expect(store.selectedUser()?.name).toBe('Bob');
    });

    it('selectedUser should return null when no selection', () => {
      expect(store.selectedUser()).toBeNull();
    });
  });
});
