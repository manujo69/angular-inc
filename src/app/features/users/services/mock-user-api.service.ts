import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserApiService } from './user-api.service';

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alice Martínez',
    email: 'alice@angular-inc.dev',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: '2',
    name: 'Bob Sánchez',
    email: 'bob@angular-inc.dev',
    role: 'editor',
    isActive: true,
    createdAt: '2024-03-22T10:30:00Z',
  },
  {
    id: '3',
    name: 'Carol López',
    email: 'carol@angular-inc.dev',
    role: 'viewer',
    isActive: false,
    createdAt: '2024-05-10T14:15:00Z',
  },
  {
    id: '4',
    name: 'David Ruiz',
    email: 'david@angular-inc.dev',
    role: 'editor',
    isActive: true,
    createdAt: '2024-07-01T09:00:00Z',
  },
  {
    id: '5',
    name: 'Eva Torres',
    email: 'eva@angular-inc.dev',
    role: 'viewer',
    isActive: false,
    createdAt: '2024-09-18T16:45:00Z',
  },
];

@Injectable()
export class MockUserApiService extends UserApiService {
  private readonly DELAY_MS = 600;

  override getAll(): Observable<User[]> {
    return of([...MOCK_USERS]).pipe(delay(this.DELAY_MS));
  }

  override getById(id: string): Observable<User> {
    const user = MOCK_USERS.find((u) => u.id === id);
    return user
      ? of({ ...user }).pipe(delay(this.DELAY_MS))
      : throwError(() => new Error(`User ${id} not found`));
  }

  override create(user: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    const created: User = {
      ...user,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    return of(created).pipe(delay(this.DELAY_MS));
  }

  override update(id: string, changes: Partial<User>): Observable<User> {
    const existing = MOCK_USERS.find((u) => u.id === id);
    if (!existing) return throwError(() => new Error(`User ${id} not found`));
    return of({ ...existing, ...changes }).pipe(delay(this.DELAY_MS));
  }

  override delete(_id: string): Observable<void> {
    return of(undefined).pipe(delay(this.DELAY_MS));
  }
}
