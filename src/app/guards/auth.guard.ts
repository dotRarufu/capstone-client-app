import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentUser = this.supabaseService.getCurrentUser();
    const isAuthenticated = !!currentUser;
    console.log('guard runs');
    if (isAuthenticated) {
      // console.log('guard allows');
      return true;
    }

    // console.log('guard disallowed');
    // console.log(`current user: ${currentUser}`);
    this.router.navigate(['login']);

    return false;
  }
}
