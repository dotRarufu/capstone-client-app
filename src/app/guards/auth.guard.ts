import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authenticatedUser = await authService.getAuthenticatedUser();

  if (authenticatedUser !== null) return true;

  console.log('user is not authenticated, and repelled by the guard');
  router.navigate(['/']);

  return false;
};
