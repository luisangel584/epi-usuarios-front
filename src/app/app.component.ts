import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DateFormatService } from './date-format.service';
import { DateFormat } from './interfaces/date-format.interface';
import { selectIsHttpLoading } from './http-loading/store/http-loading.selectors';
import { selectCurrentUserLoaded } from './users/store/users.selectors';
import * as UsersActions from './users/store/users.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'interview';
  today: string;
  loading$: Observable<boolean>;
  currentUserLoaded$: Observable<boolean>;

  constructor(private dateFormatService: DateFormatService, private store: Store) {
    this.today = this.dateFormatService.today();
    this.loading$ = this.store.select(selectIsHttpLoading);
    this.currentUserLoaded$ = this.store.select(selectCurrentUserLoaded);
  }

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadCurrentUser());
  }
}
