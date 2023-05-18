import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/old-login/login.component';
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
import { ProjectsComponent } from './capstoneAdviser/components/projects.component';
import { DashboardComponent } from './capstoneAdviser/components/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    // component: CapstoneAdviserProject,
  },
  {
    path: 'c',
    children: [
      {
        path: 'home',
        component: CapstoneAdviserHome,
        children: [
          {
            path: 'projects',
            component: ProjectsComponent,
            // canActivate: [AuthGuard],
           
          },
          // todo: add role guard, use data property
          {
            path: 'dashboard',
            component: DashboardComponent,
            // todo: this might be misplaced
            // canActivate: [AuthGuard],
      
          },

          { path: '', redirectTo: '/', pathMatch: 'full' },
        ],
      },
      {
        path: 'project',
        children: [
          {
            path: ':projectId',
            component: CapstoneAdviserProject,
            children: [
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
      { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent },
    ],
  },

  //  roles
  // parts of hte page
  // todo: when a capstone adviser role share a link to a student role, it should be automatically redirected to 's' tree
];

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    LandingPageModule,
    CapstoneAdviserModule,
    SharedModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
