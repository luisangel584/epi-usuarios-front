import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HttpLoadingTrackerService {
  private pendingRequests = new BehaviorSubject<number>(0);

  isLoading$: Observable<boolean> = this.pendingRequests.pipe(
    map(count => count > 0),
    distinctUntilChanged()
  );

  requestStarted(): void {
    this.pendingRequests.next(this.pendingRequests.value + 1);
  }

  requestFinished(): void {
    this.pendingRequests.next(Math.max(0, this.pendingRequests.value - 1));
  }
}
