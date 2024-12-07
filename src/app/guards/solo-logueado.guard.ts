import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthServicesService } from '../services/auth-services.service';
import { inject } from '@angular/core';

export const soloLogueadoGuard: CanActivateFn = (route, state) => {
  const AuthService = inject(AuthServicesService);
  const router = inject(Router);

  if (AuthService.user) return true;
  const url = router.parseUrl('/logIn');
  return new RedirectCommand(url);
};
