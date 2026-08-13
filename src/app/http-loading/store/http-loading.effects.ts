import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { HttpLoadingTrackerService } from '../http-loading-tracker.service';
import * as HttpLoadingActions from './http-loading.actions';

@Injectable()
export class HttpLoadingEffects {
  trackLoading$ = createEffect(() =>
    this.loadingTracker.isLoading$.pipe(
      map(isLoading =>
        isLoading ? HttpLoadingActions.httpLoadingStarted() : HttpLoadingActions.httpLoadingFinished()
      )
    )
  );

  constructor(private loadingTracker: HttpLoadingTrackerService) {}
}
