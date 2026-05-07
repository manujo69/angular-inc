import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { UserListComponent } from './user-list.component';
import { UsersStore } from '../state/users.store';
import { User } from '../models/user.model';

const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'u2',
    name: 'Bob Jones',
    email: 'bob@example.com',
    role: 'viewer',
    isActive: false,
    createdAt: '2024-01-02',
  },
];

function createMockStore() {
  return {
    users: signal<User[]>([]),
    selectedUserId: signal<string | null>(null),
    loading: signal(false),
    error: signal<string | null>(null),
    selectedUser: signal<User | null>(null),
    totalUsers: signal(0),
    activeUsers: signal<User[]>([]),
    loadUsers: vi.fn(),
    selectUser: vi.fn(),
    clearSelection: vi.fn(),
    deleteUser: vi.fn(),
  };
}

describe('UserListComponent', () => {
  let fixture: ComponentFixture<UserListComponent>;
  let mockStore: ReturnType<typeof createMockStore>;

  beforeEach(async () => {
    mockStore = createMockStore();

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [{ provide: UsersStore, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    fixture.detectChanges();
  });

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  it('calls loadUsers once on init', () => {
    expect(mockStore.loadUsers).toHaveBeenCalledOnce();
  });

  it('destroys without errors', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  it('shows spinner while loading', () => {
    mockStore.loading.set(true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('.spinner-border'));
    expect(spinner).not.toBeNull();
  });

  it('hides user grid while loading', () => {
    mockStore.loading.set(true);
    fixture.detectChanges();

    const grid = fixture.debugElement.query(By.css('.row.g-3'));
    expect(grid).toBeNull();
  });

  it('hides spinner when not loading', () => {
    mockStore.loading.set(false);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('.spinner-border'));
    expect(spinner).toBeNull();
  });

  // ── Error state ───────────────────────────────────────────────────────────

  it('shows error alert with message when error is set', () => {
    mockStore.error.set('Failed to load users');
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.css('.alert.alert-danger'));
    expect(alert).not.toBeNull();
    expect(alert.nativeElement.textContent).toContain('Failed to load users');
  });

  it('hides error alert when error is null', () => {
    mockStore.error.set(null);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.alert.alert-danger'))).toBeNull();
  });

  it('hides user grid when error is set', () => {
    mockStore.error.set('Some error');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.row.g-3'))).toBeNull();
  });

  // ── Header stats ──────────────────────────────────────────────────────────

  it('displays totalUsers count in the badge', () => {
    mockStore.totalUsers.set(7);
    fixture.detectChanges();

    const badge = fixture.debugElement.query(By.css('.badge.bg-primary'));
    expect(badge.nativeElement.textContent.trim()).toBe('7');
  });

  it('displays active users count', () => {
    mockStore.activeUsers.set([mockUsers[0]]);
    fixture.detectChanges();

    expect((fixture.nativeElement.textContent as string)).toContain('1 active');
  });

  it('shows 0 total users when store is empty', () => {
    mockStore.totalUsers.set(0);
    fixture.detectChanges();

    const badge = fixture.debugElement.query(By.css('.badge.bg-primary'));
    expect(badge.nativeElement.textContent.trim()).toBe('0');
  });

  // ── Users list ────────────────────────────────────────────────────────────

  it('renders one card per user', () => {
    mockStore.users.set(mockUsers);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('app-user-card'));
    expect(cards).toHaveLength(mockUsers.length);
  });

  it('shows empty-state message when users array is empty', () => {
    mockStore.users.set([]);
    fixture.detectChanges();

    const empty = fixture.debugElement.query(By.css('p.text-muted.text-center'));
    expect(empty).not.toBeNull();
    expect(empty.nativeElement.textContent).toContain('No users found');
  });

  it('hides empty-state message when users are present', () => {
    mockStore.users.set(mockUsers);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('p.text-muted.text-center'))).toBeNull();
  });

  it('renders a single user without errors', () => {
    mockStore.users.set([mockUsers[0]]);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('app-user-card'))).toHaveLength(1);
  });

  // ── Selected state ────────────────────────────────────────────────────────

  it('passes selected=true to the card matching selectedUserId', () => {
    mockStore.users.set([mockUsers[0]]);
    mockStore.selectedUserId.set(mockUsers[0].id);
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('app-user-card'));
    expect(card.componentInstance.selected()).toBe(true);
  });

  it('passes selected=false to cards not matching selectedUserId', () => {
    mockStore.users.set(mockUsers);
    mockStore.selectedUserId.set(mockUsers[0].id);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('app-user-card'));
    expect(cards[1].componentInstance.selected()).toBe(false);
  });

  it('passes selected=false to all cards when no user is selected', () => {
    mockStore.users.set(mockUsers);
    mockStore.selectedUserId.set(null);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('app-user-card'));
    cards.forEach((card) => expect(card.componentInstance.selected()).toBe(false));
  });

  // ── Store interactions ────────────────────────────────────────────────────

  it('calls store.selectUser with user id on select event', () => {
    mockStore.users.set([mockUsers[0]]);
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('app-user-card'));
    card.triggerEventHandler('select', mockUsers[0].id);

    expect(mockStore.selectUser).toHaveBeenCalledWith(mockUsers[0].id);
  });

  it('calls store.deleteUser with user id on delete event', () => {
    mockStore.users.set([mockUsers[0]]);
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('app-user-card'));
    card.triggerEventHandler('delete', mockUsers[0].id);

    expect(mockStore.deleteUser).toHaveBeenCalledWith(mockUsers[0].id);
  });

  it('does not call selectUser before any interaction', () => {
    expect(mockStore.selectUser).not.toHaveBeenCalled();
  });

  it('does not call deleteUser before any interaction', () => {
    expect(mockStore.deleteUser).not.toHaveBeenCalled();
  });
});
