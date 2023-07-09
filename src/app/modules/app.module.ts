import { NgModule, isDevMode } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { ToastrModule } from 'ngx-toastr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgChartsModule } from 'ng2-charts';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';
import { UnauthorizedComponent } from '../pages/unauthorized/unauthorized.component';
import { LandingComponent } from '../pages/landing/landing.component';
import { ProfileViewComponent } from '../pages/profile/profile-view.component';
import { Component } from '@angular/core';
import { ReportsComponent } from '../components/reports.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="h-screen w-screen">
      <router-outlet />
    </div>
  `,
})
class AppComponent {
  title = 'capstone-client-app';
}

const routes: Routes = [
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
        component: ReportsComponent,
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
    loadChildren: () => import('../student/routes'),
  },

  {
    path: 'a',
    loadChildren: () => import('../adviser/routes'),
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

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ToastrModule.forRoot({ preventDuplicates: true, progressBar: true }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    NgChartsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
