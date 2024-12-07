import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthServicesService } from '../services/auth-services.service';

export const soloPublicoGuard: CanActivateFn = (route, state) => {
  const dataAuthService = inject(AuthServicesService);
  const router = inject(Router);

  if (!dataAuthService.user) return true;
  const url = router.parseUrl('converter');
  return new RedirectCommand(url);

};