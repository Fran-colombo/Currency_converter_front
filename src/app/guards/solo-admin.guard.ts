import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthServicesService } from '../services/auth-services.service';
import { UserRole } from '../enums/user-role';

export const soloAdminGuard: CanActivateFn = (route, state) => {
  const AuthService = inject(AuthServicesService);
  const router = inject(Router);

  if (AuthService.user?.role === UserRole.Admin) return true;
  const url = router.parseUrl('/converter');
  return new RedirectCommand(url);

};
