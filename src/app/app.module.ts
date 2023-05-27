import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { ProjectComponent as CapstoneAdviserProject } from './capstoneAdviser/pages/project.component';
import { ProjectComponent as StudentProject } from './student/pages/project.component';
import { SharedModule } from './shared/shared.module';
import { FormGeneratorComponent } from './shared/components/formGenerator.component';
import { TasksComponent } from './student/components/tasks.component';
import { TasksComponent as CapstoneAdviserTasksComponent } from './capstoneAdviser/components/tasks.component';
import { LandingPageModule } from './pages/landing/landingPage.module';
import { LandingComponent } from './pages/landing/components/landing.component';
import { HomeComponent as CapstoneAdviserHome } from './capstoneAdviser/pages/home.component';
import { CapstoneAdviserModule } from './capstoneAdviser/capstoneAdviser.module';
import { roleGuard } from './guards/role.guard';
import { NotFoundComponent } from './shared/components/notFound.component';
import { FormComponent } from './shared/components/form.component';
import { HomeComponent as StudentHome } from './student/pages/home.component';
import { StudentModule } from './student/student.module';
import { ProjectsComponent } from './capstoneAdviser/components/projects.component';
import { TitleAnalyzerComponent } from './student/components/titleAnalyzer.component';
import { ResultComponent as StudentTitleAnalyzerResult } from './student/pages/result.component';
import { ParticipantsComponent } from './shared/components/participants.component';
import { ParticipantsComponent as CapstoneAdviserParticipantsComponent } from './capstoneAdviser/components/participants.component';
import { ConsultationsComponent as StudentConsultationsComponent } from './student/components/consultations.component';
import { ProjectService } from './services/project.service';
import { RedirectComponent } from './shared/components/redirect.component';
import { ConsultationsComponent as CapstoneAdviserConsultationsComponent } from './capstoneAdviser/components/consultations.component';
import { DashboardComponent } from './shared/components/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 's',
    // canActivate: [authGuard, roleGuard],
    children: [
      {
        path: 'home',
        children: [
          {
            path: 'title-analyzer',
            children: [
              {
                // todo: create 'unathorized' page
                path: 'result',
                component: StudentTitleAnalyzerResult,
              },
              {
                path: '',
                component: StudentHome,
                pathMatch: 'full',
                data: { path: 'title-analyzer' },
              },
            ],
          },
          {
            path: 'projects',
            component: StudentHome,
            data: { path: 'projects' },
          },

          { path: '', redirectTo: '/s/home/title-analyzer', pathMatch: 'full' },
        ],
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
                //todo: this comp should not be placed in shared, fix it later
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
    // canActivate: [AuthGuard, RoleGuard],
    children: [
      {
        path: 'home',
        component: CapstoneAdviserHome,

        children: [
          {
            path: 'projects',
            component: ProjectsComponent,
          },
          // todo: add role guard, use data property
          {
            path: 'dashboard',
            component: DashboardComponent,
            // todo: this might be misplaced
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
    StudentModule,
    SharedModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
