import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export const userEditGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  if (id > environment.maxEditableUserId) {
    return router.parseUrl('/users');
  }

  return true;
};
