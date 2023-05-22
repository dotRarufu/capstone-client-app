import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { ProjectComponent as CapstoneAdviserProject } from './capstoneAdviser/pages/project.component';
import { SharedModule } from './shared/shared.module';
import { FormGeneratorComponent } from './shared/components/formGenerator.component';
import { LandingPageModule } from './pages/landing/landingPage.module';
import { LandingComponent } from './pages/landing/components/landing.component';
import { HomeComponent as CapstoneAdviserHome } from './capstoneAdviser/pages/home.component';
import { CapstoneAdviserModule } from './capstoneAdviser/capstoneAdviser.module';
import { RoleGuard } from './guards/role.guard';
import { NotFoundComponent } from './shared/components/notFound.component';
import { FormComponent } from './shared/components/form.component';
import { DashboardComponent } from './capstoneAdviser/components/dashboard.component';
import { HomeComponent as StudentHome } from './student/pages/home.component';
import { StudentModule } from './student/student.module';
import { ProjectsComponent } from './student/components/projects.component';
import { TitleAnalyzerComponent } from './student/components/titleAnalyzer.component';
import { ResultComponent as StudentTitleAnalyzerResult } from './student/pages/result.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 's',
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'title-analyzer',
            children: [
              {
                path: 'result',
                component: StudentTitleAnalyzerResult,
                canActivate: [AuthGuard],
              },
              {
                path: '',
                // component: TitleAnalyzerComponent,
                component: StudentHome,
                canActivate: [AuthGuard],
                pathMatch: 'full',
                data: {path: 'title-analyzer'}
              },
            ],
          },
          {
            path: 'projects',
            canActivate: [AuthGuard],
            component: StudentHome,
            data: {path: 'projects'}
          },
          { path: '', redirectTo: '/s/home/title-analyzer', pathMatch: 'full' },
        ],
      },
      {
        path: 'project',
        children: [
          {
            path: ':projectId',
            component: CapstoneAdviserProject,
            canActivate: [AuthGuard],
            children: [
              {
                path: 'forms',
                component: FormGeneratorComponent,
                canActivate: [AuthGuard],
                children: [
                  {
                    path: '1',
                    component: FormComponent,
                    canActivate: [AuthGuard],
                  },
                  {
                    path: '2',
                    component: FormComponent,
                    canActivate: [AuthGuard],
                  },
                  {
                    path: '3',
                    component: FormComponent,
                    canActivate: [AuthGuard],
                  },
                  {
                    path: '4',
                    component: FormComponent,
                    canActivate: [AuthGuard],
                  },
                ],
              },
            ],
          },
          { path: '', redirectTo: '/c/home/projects', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: '/s/home/title-analyzer', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent },
    ],
  },
  {
    path: 'c',
    children: [
      {
        path: 'home',
        component: CapstoneAdviserHome,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'projects',
            component: ProjectsComponent,
            canActivate: [AuthGuard],
          },
          // todo: add role guard, use data property
          {
            path: 'dashboard',
            component: DashboardComponent,
            // todo: this might be misplaced
            canActivate: [AuthGuard],
          },

          { path: '', redirectTo: '/c/home/projects', pathMatch: 'full' },
        ],
      },
      {
        path: 'project',
        canActivate: [AuthGuard],
        children: [
          {
            path: ':projectId',
            component: CapstoneAdviserProject,
            canActivate: [AuthGuard],
            children: [
              {
                path: 'forms',
                component: FormGeneratorComponent,
                canActivate: [AuthGuard],
                children: [
                  {
                    path: '1',
                    component: FormComponent,
                    canActivate: [AuthGuard],
                  },
                  {
                    path: '2',
                    component: FormComponent,
                    canActivate: [AuthGuard],
                  },
                  {
                    path: '3',
                    component: FormComponent,
                    canActivate: [AuthGuard],
                  },
                  {
                    path: '4',
                    component: FormComponent,
                    canActivate: [AuthGuard],
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
