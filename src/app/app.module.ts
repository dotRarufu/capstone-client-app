import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  NgModule,
  isDevMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { CapstoneAdviserProjectComponent as CapstoneAdviserProject } from './capstoneAdviser/pages/project.component';
import { TechnicalAdviserProjectComponent as TechnicalAdviserProject } from './technicalAdviser/pages/project.component';
import { StudentProjectComponent as StudentProject } from './student/pages/project.component';
import { SharedModule } from './shared/shared.module';
import { FormGeneratorComponent } from './shared/components/formGenerator.component';
import { TasksComponent } from './student/components/tasks.component';
import { TasksComponent as CapstoneAdviserTasksComponent } from './capstoneAdviser/components/tasks.component';
import { TasksComponent as TechnicalAdviserTasksComponent } from './technicalAdviser/components/tasks.component';
import { LandingPageModule } from './pages/landing/landingPage.module';
import { LandingComponent } from './pages/landing/components/landing.component';
import { HomeComponent as CapstoneAdviserHome } from './capstoneAdviser/pages/home.component';
import { TechnicalAdviserHomeComponent as TechnicalAdviserHome } from './technicalAdviser/pages/home.component';
import { CapstoneAdviserModule } from './capstoneAdviser/capstoneAdviser.module';
import { TechnicalAdviserModule } from './technicalAdviser/technicalAdviser.module';
import { roleGuard } from './guards/role.guard';
import { NotFoundComponent } from './shared/components/notFound.component';
import { FormComponent } from './shared/components/form.component';
import { StudentHomeComponent as StudentHome } from './student/pages/home.component';
import { StudentModule } from './student/student.module';
import { CapstoneAdviserProjectsComponent } from './capstoneAdviser/components/projects.component';
import { TechnicalAdviserProjectsComponent as TechnicalAdviserProjectsComponent } from './technicalAdviser/components/projects.component';
import { TitleAnalyzerComponent } from './student/components/titleAnalyzer.component';
import { ResultComponent as StudentTitleAnalyzerResult } from './student/pages/result.component';
import { ParticipantsComponent } from './student/components/participants.component';
import { ParticipantsComponent as CapstoneAdviserParticipantsComponent } from './capstoneAdviser/components/participants.component';
import { ParticipantsComponent as TechnicalAdviserParticipantsComponent } from './technicalAdviser/components/participants.component';
import { ConsultationsComponent as StudentConsultationsComponent } from './student/components/consultations.component';
import { TitleAnalyzerComponent as StudentTitleAnalyzerComponent } from './student/components/titleAnalyzer.component';
import { ProjectsComponent as StudentProjectsComponent } from './student/components/projects.component';
import { TitleBuilderComponent as StudentTitleBuilder } from './student/components/titleBuilder.component';
import { ProjectService } from './services/project.service';
import { RedirectComponent } from './shared/components/redirect.component';
import { ConsultationsComponent as CapstoneAdviserConsultationsComponent } from './capstoneAdviser/components/consultations.component';
import { ConsultationsComponent as TechnicalAdviserConsultationsComponent } from './technicalAdviser/components/consultations.component';
import { DashboardComponent } from './shared/components/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProfileComponent } from './shared/components/profile.component';
import { ProfileViewComponent } from './shared/components/profileView.component';
import { ToastrModule } from 'ngx-toastr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgChartsModule } from 'ng2-charts';

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
    // canActivate: [authGuard, roleGuard],
    children: [
      {
        path: 'home',
        component: StudentHome,
        children: [
          {
            path: 'title-analyzer',
            component: StudentTitleAnalyzerComponent,
          },
          {
            path: 'projects',
            component: StudentProjectsComponent,
          },
          {
            path: 'title-analyzer-result',
            component: StudentTitleAnalyzerResult,
          },

          { path: '', redirectTo: '/s/home/title-analyzer', pathMatch: 'full' },
        ],
      },
      {
        path: 'title-builder',
        component: StudentTitleBuilder,
      },
      {
        path: 'project',
        children: [
          {
            path: ':projectId',
            component: StudentProject,
            children: [
              {
                path: 'dashboard',
                component: DashboardComponent,
              },
              {
                path: 'tasks',
                component: TasksComponent,
              },
              {
                path: 'participants',
                component: ParticipantsComponent,
              },
              {
                path: 'consultations',
                component: StudentConsultationsComponent,
              },
              {
                path: 'forms',
                component: FormGeneratorComponent,

                children: [
                  {
                    path: '1',
                    component: FormComponent,
                  },
                  {
                    path: '2',
                    component: FormComponent,
                  },
                  {
                    path: '3',
                    component: FormComponent,
                  },
                  {
                    path: '4',
                    component: FormComponent,
                  },
                ],
              },
              {
                path: '',
                component: RedirectComponent,
                // redirectTo: redirectToNewPath, pathMatch: 'full'
                data: { path: ['s', 'project'] },
              },
            ],
          },
          { path: '', redirectTo: '/s/home/projects', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: '/s/home/title-analyzer', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent },
    ],
  },
  {
    path: 'c',
    // canActivate: [authGuard, roleGuard],
    children: [
      {
        path: 'home',
        component: CapstoneAdviserHome,

        children: [
          {
            path: 'projects',
            component: CapstoneAdviserProjectsComponent,
            // component: CapstoneAdviserHome,
          },
          {
            path: 'dashboard',
            component: DashboardComponent,
            // component: CapstoneAdviserHome,
          },

          { path: '', redirectTo: '/c/home/projects', pathMatch: 'full' },
        ],
      },
      {
        path: 'project',
        // canActivate: [authGuard],
        children: [
          {
            path: ':projectId',
            component: CapstoneAdviserProject,

            children: [
              {
                path: 'tasks',
                component: CapstoneAdviserTasksComponent,
              },
              {
                path: 'participants',
                component: CapstoneAdviserParticipantsComponent,
              },
              {
                path: 'consultations',
                component: CapstoneAdviserConsultationsComponent,
              },
              {
                path: 'dashboard',
                component: DashboardComponent,
              },
              {
                path: 'forms',
                component: FormGeneratorComponent,

                children: [
                  {
                    path: '1',
                    component: FormComponent,
                  },
                  {
                    path: '2',
                    component: FormComponent,
                  },
                  {
                    path: '3',
                    component: FormComponent,
                  },
                  {
                    path: '4',
                    component: FormComponent,
                  },
                ],
              },
              {
                path: '',
                component: RedirectComponent,
                // redirectTo: redirectToNewPath, pathMatch: 'full'
                data: { path: ['c', 'project'] },
              },
            ],
          },
          { path: '', redirectTo: '/c/home/projects', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: '/c/home/projects', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent },
    ],
  },
  {
    path: 't',
    // canActivate: [authGuard, roleGuard],
    children: [
      {
        path: 'home',
        component: TechnicalAdviserHome,

        children: [
          {
            path: 'projects',
            component: TechnicalAdviserProjectsComponent,
          },
          {
            path: 'dashboard',
            component: DashboardComponent,
          },

          { path: '', redirectTo: '/t/home/projects', pathMatch: 'full' },
        ],
      },
      {
        path: 'project',
        // canActivate: [authGuard],
        children: [
          {
            path: ':projectId',
            component: TechnicalAdviserProject,

            children: [
              {
                path: 'tasks',
                component: TechnicalAdviserTasksComponent,
              },
              {
                path: 'participants',
                component: TechnicalAdviserParticipantsComponent,
              },
              {
                path: 'consultations',
                component: TechnicalAdviserConsultationsComponent,
              },
              {
                path: 'dashboard',
                component: DashboardComponent,
              },
              {
                path: 'forms',
                component: FormGeneratorComponent,

                children: [
                  {
                    path: '1',
                    component: FormComponent,
                  },
                  {
                    path: '2',
                    component: FormComponent,
                  },
                  {
                    path: '3',
                    component: FormComponent,
                  },
                  {
                    path: '4',
                    component: FormComponent,
                  },
                ],
              },
              {
                path: '',
                component: RedirectComponent,
                // redirectTo: redirectToNewPath, pathMatch: 'full'
                data: { path: ['t', 'project'] },
              },
            ],
          },
          { path: '', redirectTo: '/t/home/projects', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: '/t/home/projects', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent },
    ],
  },

  //  roles
  // parts of hte page
  // todo: when a capstone adviser role share a link to a student role, it should be automatically redirected to 's' tree
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    LandingPageModule,
    CapstoneAdviserModule,
    TechnicalAdviserModule,
    StudentModule,
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
