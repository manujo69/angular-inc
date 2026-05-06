import { TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';
import { User } from '../models/user.model';

const mockUser: User = {
  id: '1',
  name: 'Alice Martínez',
  email: 'alice@angular-inc.dev',
  role: 'admin',
  isActive: true,
  createdAt: '2024-01-15T08:00:00Z',
};

describe('UserCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
    }).compileComponents();
  });

  function setup(user = mockUser, selected = false) {
    const fixture = TestBed.createComponent(UserCardComponent);
    fixture.componentRef.setInput('user', user);
    fixture.componentRef.setInput('selected', selected);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    expect(setup().componentInstance).toBeTruthy();
  });

  it('should display user name and email', () => {
    const el = setup().nativeElement as HTMLElement;
    expect(el.querySelector('.card-title')?.textContent?.trim()).toBe('Alice Martínez');
    expect(el.querySelector('.card-text')?.textContent?.trim()).toBe('alice@angular-inc.dev');
  });

  it('should display the user role', () => {
    const el = setup().nativeElement as HTMLElement;
    expect(el.querySelector('.badge.bg-light')?.textContent?.trim()).toBe('admin');
  });

  it('should show Active badge for active users', () => {
    const badge = setup().nativeElement.querySelector('.badge.bg-success') as HTMLElement;
    expect(badge?.textContent?.trim()).toBe('Active');
  });

  it('should show Inactive badge for inactive users', () => {
    const badge = setup({ ...mockUser, isActive: false }).nativeElement.querySelector('.badge.bg-secondary') as HTMLElement;
    expect(badge?.textContent?.trim()).toBe('Inactive');
  });

  it('should apply border-primary class when selected', () => {
    const card = setup(mockUser, true).nativeElement.querySelector('.card') as HTMLElement;
    expect(card.classList).toContain('border-primary');
  });

  it('should not apply border-primary when not selected', () => {
    const card = setup(mockUser, false).nativeElement.querySelector('.card') as HTMLElement;
    expect(card.classList).not.toContain('border-primary');
  });

  it('should emit select with user id on card click', () => {
    const fixture = setup();
    const emitted: string[] = [];
    fixture.componentInstance.select.subscribe((id) => emitted.push(id));
    (fixture.nativeElement.querySelector('.card') as HTMLElement).click();
    expect(emitted).toEqual(['1']);
  });

  it('should emit delete with user id on delete button click', () => {
    const fixture = setup();
    const emitted: string[] = [];
    fixture.componentInstance.delete.subscribe((id) => emitted.push(id));
    (fixture.nativeElement.querySelector('button') as HTMLElement).click();
    expect(emitted).toEqual(['1']);
  });

  it('should not emit select when delete button is clicked', () => {
    const fixture = setup();
    const selectEmitted: string[] = [];
    fixture.componentInstance.select.subscribe((id) => selectEmitted.push(id));
    (fixture.nativeElement.querySelector('button') as HTMLElement).click();
    expect(selectEmitted).toHaveLength(0);
  });
});
