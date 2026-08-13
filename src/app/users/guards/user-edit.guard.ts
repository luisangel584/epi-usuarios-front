import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

const MAX_EDITABLE_USER_ID = 10;

export const userEditGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  if (id > MAX_EDITABLE_USER_ID) {
    return router.parseUrl('/users');
  }

  return true;
};
