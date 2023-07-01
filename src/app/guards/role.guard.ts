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

export const roleGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userService = inject(UserService);

  let userRole: number | null = null;
  const authenticatedUser = await authService.getAuthenticatedUser();

  if (authenticatedUser === null)
    throw new Error('no current user and authenticated user');

  const userDetails = await userService.getUser(authenticatedUser.uid);
  userRole = userDetails.role_id;

  if (userRole === null) throw new Error('wip, currentUser has no role id');

  const firstChild = state.root.firstChild;

  if (!firstChild) throw new Error('first child is undefined');

  const root = firstChild.url.toString();
  const userRolePath = getRolePath(userRole);

  if (root === userRolePath) return true;

  console.log('repelled by role guard:', userRolePath, userRole);
  router.navigate(['/', 'unauthorized']);

  return false;
};
