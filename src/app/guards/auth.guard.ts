import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authenticatedUser$ = authService.getAuthenticatedUser().pipe(
    map((user) => {
      if (user !== null) return true;

      return false;
    }),
    tap((dec) => {
      if (dec) return;

      console.log('user is not authenticated, and repelled by the guard');
      router.navigate(['/']);
    }),
    catchError((err) => {
      console.log('error occured:', err);

      router.navigate(['/']);
      return of(false);
    })
  );

  return authenticatedUser$;
};
