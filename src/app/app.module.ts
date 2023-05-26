import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { ProjectComponent as CapstoneAdviserProject } from './capstoneAdviser/pages/project.component';
import { ProjectComponent as StudentProject } from './student/pages/project.component';
import { SharedModule } from './shared/shared.module';
import { FormGeneratorComponent } from './shared/components/formGenerator.component';
import { TasksComponent } from './shared/components/tasks.component';
import { LandingPageModule } from './pages/landing/landingPage.module';
import { LandingComponent } from './pages/landing/components/landing.component';
import { HomeComponent as CapstoneAdviserHome } from './capstoneAdviser/pages/home.component';
import { CapstoneAdviserModule } from './capstoneAdviser/capstoneAdviser.module';
import { roleGuard } from './guards/role.guard';
import { NotFoundComponent } from './shared/components/notFound.component';
import { FormComponent } from './shared/components/form.component';
import { DashboardComponent } from './capstoneAdviser/components/dashboard.component';
import { HomeComponent as StudentHome } from './student/pages/home.component';
import { StudentModule } from './student/student.module';
import { ProjectsComponent } from './capstoneAdviser/components/projects.component';
import { TitleAnalyzerComponent } from './student/components/titleAnalyzer.component';
import { ResultComponent as StudentTitleAnalyzerResult } from './student/pages/result.component';

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
                path: 'tasks',
                component: TasksComponent,
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
                component: TasksComponent,
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
