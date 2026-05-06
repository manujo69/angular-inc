import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { UserListComponent } from './user-list.component';
import { UsersStore } from '../state/users.store';
import { User } from '../models/user.model';

const mockUsers: User[] = [
  { id: '1', name: 'Alice', email: 'alice@test.com', role: 'admin', isActive: true, createdAt: '' },
  { id: '2', name: 'Bob', email: 'bob@test.com', role: 'viewer', isActive: false, createdAt: '' },
];

function buildStoreMock(overrides: Partial<{
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUserId: string | null;
}> = {}) {
  const users = overrides.users ?? mockUsers;
  return {
    users: signal(users),
    loading: signal(overrides.loading ?? false),
    error: signal(overrides.error ?? null),
    selectedUserId: signal(overrides.selectedUserId ?? null),
    totalUsers: signal(users.length),
    activeUsers: signal(users.filter((u) => u.isActive)),
    loadUsers: vi.fn(),
    selectUser: vi.fn(),
    deleteUser: vi.fn(),
  };
}

describe('UserListComponent', () => {
  async function setup(storeOverrides?: Parameters<typeof buildStoreMock>[0]) {
    const storeMock = buildStoreMock(storeOverrides);
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [{ provide: UsersStore, useValue: storeMock }],
    }).compileComponents();
    const fixture = TestBed.createComponent(UserListComponent);
    fixture.detectChanges();
    return { fixture, storeMock };
  }

  it('should create', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call loadUsers on init', async () => {
    const { storeMock } = await setup();
    expect(storeMock.loadUsers).toHaveBeenCalledOnce();
  });

  it('should show total and active user counts', async () => {
    const { fixture } = await setup();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.badge')?.textContent?.trim()).toBe('2');
    expect(el.querySelector('.text-muted.small')?.textContent).toContain('1 active');
  });

  it('should show spinner when loading', async () => {
    const { fixture } = await setup({ loading: true });
    expect(fixture.nativeElement.querySelector('.spinner-border')).toBeTruthy();
  });

  it('should hide user cards while loading', async () => {
    const { fixture } = await setup({ loading: true });
    expect(fixture.nativeElement.querySelector('app-user-card')).toBeNull();
  });

  it('should show error alert when error is set', async () => {
    const { fixture } = await setup({ error: 'Network error' });
    const alert = fixture.nativeElement.querySelector('.alert-danger') as HTMLElement;
    expect(alert?.textContent).toContain('Network error');
  });

  it('should render a card per user', async () => {
    const { fixture } = await setup();
    const cards = fixture.nativeElement.querySelectorAll('app-user-card');
    expect(cards.length).toBe(2);
  });

  it('should show empty message when no users', async () => {
    const { fixture } = await setup({ users: [] });
    const msg = fixture.nativeElement.querySelector('p.text-muted') as HTMLElement;
    expect(msg?.textContent).toContain('No users found.');
  });
});
