import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { HttpLoadingTrackerService } from '../http-loading/http-loading-tracker.service';

export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingTracker = inject(HttpLoadingTrackerService);

  loadingTracker.requestStarted();

  return next(req).pipe(
    finalize(() => loadingTracker.requestFinished())
  );
};
