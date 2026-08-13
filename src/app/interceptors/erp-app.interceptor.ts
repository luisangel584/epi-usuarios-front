import { HttpInterceptorFn } from '@angular/common/http';

export const erpAppInterceptor: HttpInterceptorFn = (req, next) => {
  const erpReq = req.clone({
    setHeaders: { 'X-ERP-APP': 'testing' },
  });

  return next(erpReq);
};
