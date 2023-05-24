import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';
import {inject} from '@angular/core';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();
    const isAuthenticated = !!currentUser;

    if (isAuthenticated) {
      // console.log('user is authenticated, and passed the guard');
      return true;
    }
    
    console.log('user is not authenticated, and repelled by the guard');
    router.navigate(['/']);
    
    return false
};