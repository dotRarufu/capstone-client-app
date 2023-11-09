import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, from, map, of, tap } from 'rxjs';
import supabaseClient from '../lib/supabase';

export const signupAuthGuard: CanActivateFn = () => {
  const router = inject(Router);

  const client = supabaseClient;

  const authenticatedUser$ = from(client.auth.getUser()).pipe(
    map((response) => response.data.user),
    map((user) => {
      if (user === null) {
        console.log(
          'User is not authenticated, and repelled by the auth guard 2'
        );
        router.navigate(['/login']);
        return false;
      }

      return true;
    })
  );
  return authenticatedUser$;
};
