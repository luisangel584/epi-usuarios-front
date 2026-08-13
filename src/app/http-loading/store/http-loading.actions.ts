import { createAction } from '@ngrx/store';

export const httpLoadingStarted = createAction('[Http Loading] Started');
export const httpLoadingFinished = createAction('[Http Loading] Finished');
