import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  template: `
    <div
      class="card h-100 shadow-sm"
      [ngClass]="{ 'border-primary': selected() }"
      style="cursor: pointer"
      (click)="select.emit(user().id)"
    >
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h6 class="card-title mb-0 fw-semibold">{{ user().name }}</h6>
          <span
            class="badge"
            [ngClass]="user().isActive ? 'bg-success' : 'bg-secondary'"
          >
            {{ user().isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>
        <p class="card-text text-muted small mb-2">{{ user().email }}</p>
        <span class="badge bg-light text-dark text-capitalize">{{ user().role }}</span>
      </div>
      <div class="card-footer bg-transparent d-flex justify-content-end gap-2">
        <button
          class="btn btn-sm btn-outline-danger"
          (click)="onDelete($event)"
          aria-label="Delete user"
        >
          Delete
        </button>
      </div>
    </div>
  `,
})
export class UserCardComponent {
  user = input.required<User>();
  selected = input(false);
  select = output<string>();
  delete = output<string>();

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.user().id);
  }
}
