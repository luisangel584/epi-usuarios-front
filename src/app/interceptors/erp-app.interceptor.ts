import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const erpAppInterceptor: HttpInterceptorFn = (req, next) => {
  const erpReq = req.clone({
    setHeaders: { 'X-ERP-APP': environment.erpAppHeaderValue },
  });

  return next(erpReq);
};
