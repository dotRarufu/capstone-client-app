import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { getRolePath } from '../utils/getRolePath';
import { map, switchMap, tap } from 'rxjs';

export const roleGuard = (role: string) => {
  const guard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const userService = inject(UserService);

    const authenticatedUser$ = authService.getAuthenticatedUser().pipe(
      map((user) => {
        if (user === null)
          throw new Error('no current user and authenticated user');

        return user;
      }),
      switchMap((user) => userService.getUser(user.uid)),
      map((user) => user.role_id),
      map((role) => {
        if (role === null) throw new Error('wip, currentUser has no role id');

        return role;
      }),
      map((role) => getRolePath(role)),
      map((rolePath) => {
        if (role === rolePath) return true;

        return false;
      }),
      tap((dec) => {
        if (dec) return;

        console.log('repelled by role guard:', 'path role:', role);
        router.navigate(['/', 'unauthorized']);
      })
    );

    return authenticatedUser$;
  };

  return guard;
};
