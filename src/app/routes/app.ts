import {  Routes } from '@angular/router';
import { LandingComponent } from '../pages/landing/landing.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { ProfileViewComponent } from '../pages/profile/profile-view.component';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';
import { UnauthorizedComponent } from '../pages/unauthorized/unauthorized.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { AdviserProfileReportsComponent } from '../pages/profile/profile-reports.component';

export const app: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      {
        path: 'reports',
        component: AdviserProfileReportsComponent,
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
    // data: { breadcrumb: "Home" },
    data: { breadcrumb: { skip: true } },
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
