import { NgModule, isDevMode } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { CapstoneAdviserProjectComponent as CapstoneAdviserProject } from './capstoneAdviser/pages/project.component';
import { TechnicalAdviserProjectComponent as TechnicalAdviserProject } from './technicalAdviser/pages/project.component';
import { SharedModule } from './shared/shared.module';
import { FormGeneratorComponent } from './shared/components/formGenerator.component';
import { TasksComponent as CapstoneAdviserTasksComponent } from './capstoneAdviser/components/tasks.component';
import { TasksComponent as TechnicalAdviserTasksComponent } from './technicalAdviser/components/tasks.component';
import { LandingPageModule } from './pages/landing/landingPage.module';
import { LandingComponent } from './pages/landing/components/landing.component';
import { HomeComponent as CapstoneAdviserHome } from './capstoneAdviser/pages/home.component';
import { TechnicalAdviserHomeComponent as TechnicalAdviserHome } from './technicalAdviser/pages/home.component';
import { TechnicalAdviserModule } from './technicalAdviser/technicalAdviser.module';
import { NotFoundComponent } from './shared/components/notFound.component';
import { FormComponent } from './shared/components/form.component';
import { CapstoneAdviserProjectsComponent } from './capstoneAdviser/components/projects.component';
import { TechnicalAdviserProjectsComponent as TechnicalAdviserProjectsComponent } from './technicalAdviser/components/projects.component';
import { ParticipantsComponent as CapstoneAdviserParticipantsComponent } from './capstoneAdviser/components/participants.component';
import { ParticipantsComponent as TechnicalAdviserParticipantsComponent } from './technicalAdviser/components/participants.component';
import { RedirectComponent } from './shared/components/redirect.component';
import { ConsultationsComponent as CapstoneAdviserConsultationsComponent } from './capstoneAdviser/components/consultations.component';
import { ConsultationsComponent as TechnicalAdviserConsultationsComponent } from './technicalAdviser/components/consultations.component';
import { DashboardComponent } from './shared/components/dashboard.component';
import { ProfileComponent } from './shared/components/profile.component';
import { ProfileViewComponent } from './shared/components/profileView.component';
import { ToastrModule } from 'ngx-toastr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgChartsModule } from 'ng2-charts';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

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
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'view',
        component: ProfileViewComponent,
      },
      {
        path: '',
        redirectTo: '/profile/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 's',
    canActivate: [authGuard, roleGuard],
    loadChildren: () =>
      import('./student/student.module').then((m) => m.StudentModule),
  },
  {
    path: 'c',
    canActivate: [authGuard, roleGuard],
    loadChildren: () =>
      import('./capstoneAdviser/capstoneAdviser.module').then(
        (m) => m.CapstoneAdviserModule
      ),
  },

  {
    path: 't',
    canActivate: [authGuard, roleGuard],
    loadChildren: () =>
      import('./technicalAdviser/technicalAdviser.module').then(
        (m) => m.TechnicalAdviserModule
      ),
  },

  //  roles
  // parts of hte page
  // todo: when a capstone adviser role share a link to a student role, it should be automatically redirected to 's' tree
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    LandingPageModule,
    SharedModule,
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
