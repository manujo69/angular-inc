import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserCardComponent } from './user-card.component';
import { User } from '../models/user.model';

const mockUser: User = {
  id: 'u1',
  name: 'Alice Smith',
  email: 'alice@example.com',
  role: 'admin',
  isActive: true,
  createdAt: '2024-01-01',
};

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  function createComponent(user: User = mockUser, selected = false) {
    fixture = TestBed.createComponent(UserCardComponent);
    fixture.componentRef.setInput('user', user);
    fixture.componentRef.setInput('selected', selected);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
    }).compileComponents();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders user name, email and role', () => {
    createComponent();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain(mockUser.name);
    expect(text).toContain(mockUser.email);
    expect(text).toContain(mockUser.role);
  });

  it('shows "Active" badge for active users', () => {
    createComponent();
    const badge = fixture.debugElement.query(By.css('.badge.bg-success'));
    expect(badge).not.toBeNull();
    expect(badge.nativeElement.textContent.trim()).toBe('Active');
  });

  it('shows "Inactive" badge for inactive users', () => {
    createComponent({ ...mockUser, isActive: false });
    const badge = fixture.debugElement.query(By.css('.badge.bg-secondary'));
    expect(badge).not.toBeNull();
    expect(badge.nativeElement.textContent.trim()).toBe('Inactive');
  });

  // ── selected input ────────────────────────────────────────────────────────

  it('applies border-primary class when selected is true', () => {
    createComponent(mockUser, true);
    const card = fixture.debugElement.query(By.css('.card'));
    expect(card.classes['border-primary']).toBe(true);
  });

  it('does not apply border-primary class when selected is false', () => {
    createComponent(mockUser, false);
    const card = fixture.debugElement.query(By.css('.card'));
    expect(card.classes['border-primary']).toBeFalsy();
  });

  // ── select output ─────────────────────────────────────────────────────────

  it('emits user id via select when card body is clicked', () => {
    createComponent();
    const selectSpy = vi.fn();
    component.select.subscribe(selectSpy);
    const card = fixture.debugElement.query(By.css('.card'));
    card.triggerEventHandler('click', new MouseEvent('click'));
    expect(selectSpy).toHaveBeenCalledWith(mockUser.id);
  });

  it('emits exactly once per click', () => {
    createComponent();
    const selectSpy = vi.fn();
    component.select.subscribe(selectSpy);
    const card = fixture.debugElement.query(By.css('.card'));
    card.triggerEventHandler('click', new MouseEvent('click'));
    card.triggerEventHandler('click', new MouseEvent('click'));
    expect(selectSpy).toHaveBeenCalledTimes(2);
  });

  // ── delete output ─────────────────────────────────────────────────────────

  it('emits user id via delete when Delete button is clicked', () => {
    createComponent();
    const deleteSpy = vi.fn();
    component.delete.subscribe(deleteSpy);
    const btn = fixture.debugElement.query(By.css('button[aria-label="Delete user"]'));
    btn.triggerEventHandler('click', new MouseEvent('click'));
    expect(deleteSpy).toHaveBeenCalledWith(mockUser.id);
  });

  it('does not emit select when Delete button is clicked (stopPropagation)', () => {
    createComponent();
    const selectSpy = vi.fn();
    component.select.subscribe(selectSpy);

    const event = new MouseEvent('click');
    vi.spyOn(event, 'stopPropagation');
    const btn = fixture.debugElement.query(By.css('button[aria-label="Delete user"]'));
    btn.triggerEventHandler('click', event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(selectSpy).not.toHaveBeenCalled();
  });

  // ── onDelete method ───────────────────────────────────────────────────────

  it('onDelete stops event propagation and emits user id', () => {
    createComponent();
    const deleteSpy = vi.fn();
    component.delete.subscribe(deleteSpy);
    const event = new MouseEvent('click');
    vi.spyOn(event, 'stopPropagation');

    component.onDelete(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith(mockUser.id);
  });

  // ── role display ──────────────────────────────────────────────────────────

  it.each<User['role']>(['admin', 'editor', 'viewer'])(
    'displays role "%s" in a badge',
    (role) => {
      createComponent({ ...mockUser, role });
      const roleBadge = fixture.debugElement
        .queryAll(By.css('.badge'))
        .find((el) => el.nativeElement.textContent.trim() === role);
      expect(roleBadge).toBeDefined();
    },
  );

  // ── lifecycle ─────────────────────────────────────────────────────────────

  it('destroys without errors', () => {
    createComponent();
    expect(() => fixture.destroy()).not.toThrow();
  });
});
