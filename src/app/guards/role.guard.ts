import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';


export const roleGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const state = inject(ActivatedRouteSnapshot);

  const currentUser = authService.getCurrentUser();

  if (!currentUser) throw new Error('wip, currentUser is not authenticated');
  if (currentUser.role_id === null)
    throw new Error('wip, currentUser has no role id');

  const userRole = currentUser.role_id;
  const firstChild = state.root.firstChild;

  if (!firstChild) throw new Error('first child is undefined');

  const root = firstChild.url.toString();
  const userRolePath = getRolePath(userRole);

  if (root === userRolePath) return true;

  // todo: navigate to unauthorized
  router.navigate([userRolePath]);

  return false;
};

const getRolePath = (roleId: number) => {
  let role = 'a';

  switch (roleId) {
    case 0:
      role = 's';
      break;
    case 1:
      role = 'c';
      break;
    case 2:
      role = 't';
      break;
    default:
      throw new Error('user role error');
  }

  return role;
};
