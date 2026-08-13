import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { User } from "../../models/user.model";
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    NgForOf,
    ConfirmDialogComponent
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {

  @Input() users: User[] = [];
  @Input() loading = false;
  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<number>();

  pendingDeleteId: number | null = null;

  requestDelete(id: number): void {
    this.pendingDeleteId = id;
  }

  confirmDelete(): void {
    if (this.pendingDeleteId !== null) {
      this.delete.emit(this.pendingDeleteId);
      this.pendingDeleteId = null;
    }
  }

  cancelDelete(): void {
    this.pendingDeleteId = null;
  }

}
