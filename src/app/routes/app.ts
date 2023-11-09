import { Routes } from '@angular/router';
import { LandingComponent } from '../pages/landing/landing.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { ProfileViewComponent } from '../pages/profile/profile-view.component';
import { authGuard } from '../guards/auth.guard';
import { signupAuthGuard } from '../guards/signup-auth.guard';
import { roleGuard } from '../guards/role.guard';
import { UnauthorizedComponent } from '../pages/unauthorized/unauthorized.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { AdviserProfileReportsComponent } from '../pages/profile/adviser-profile-reports.component';
import { ProfileReportsComponent } from '../pages/profile/profile-reports.component';
import { SignupComponent } from '../pages/landing/components/signup.component';
import { LoginComponent } from '../pages/landing/components/login.component';
import { SignupContinueComponent } from '../pages/landing/components/signup-continue.component';

export const app: Routes = [
  {
    //todo: add guard using this from(this.client.auth.getUser())
    canActivate: [signupAuthGuard],
    path: 'signup-continue',
    component: SignupContinueComponent,
  },
  {
    path: '',
    component: LandingComponent,

    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },

      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      {
        path: 'reports',
        component: ProfileReportsComponent,
      },
      {
        path: 'view',
        component: ProfileViewComponent,
      },
      {
        path: '',
        redirectTo: '/profile/reports',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 's',
    canActivate: [authGuard, roleGuard('s')],
    data: { breadcrumb: 'Home' },
    loadChildren: () => import('./student'),
  },

  {
    path: 'a',
    canActivate: [authGuard, roleGuard('a')],
    data: { breadcrumb: 'Home' },
    loadChildren: () => import('./adviser'),
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  { path: '**', component: NotFoundComponent },

  //  roles
  // parts of hte page
  // todo: when a capstone adviser role share a link to a student role, it should be automatically redirected to 's' tree
];
