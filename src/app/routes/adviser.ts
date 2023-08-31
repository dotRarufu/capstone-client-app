import { Routes } from '@angular/router';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';
import { participantGuard } from '../guards/participant.guard';
import { RedirectComponent } from '../components/redirect.component';
import { FormGeneratorComponent } from '../pages/forms/form-generator.component';
import { TasksPageComponent } from '../pages/project/pages/tasks/tasks.component';
import { ConsultationsComponent } from '../pages/project/pages/consultations/consultations.component';
import { ProjectPageComponent } from '../pages/project/project.component';
import { MilestonesComponent } from '../pages/project/pages/milestones/milestones.component';
import { GeneralComponent } from '../pages/project/pages/project/general.component';
import { DangerZoneComponent } from '../pages/project/pages/project/danger-zone.component';
import { ProjectComponent } from '../pages/project/pages/project/project.component';
import { MilestoneInfoComponent } from '../pages/project/pages/milestones/info.component';
import { HomePageComponent } from '../pages/home/home.component';
import { ReportsComponent } from '../pages/home/reports.component';
import { FormComponent } from '../pages/forms/form.component';
import { Form3Component } from '../pages/forms/form-3.component';

const routes: Routes = [
  {
    path: 'c',
    canActivate: [authGuard, roleGuard('c')],
    data: { breadcrumb: 'Home' },
    children: [
      {
        path: 'home',
        data: { role: 'c' },
        component: HomePageComponent,
        children: [
          {
            path: 'projects',

            // does not matter, is rendered in home component
            component: ProjectPageComponent,
          },
          {
            path: 'reports',
            component: ReportsComponent,
            // does not matter, is rendered in home component
          },

          { path: '', redirectTo: '/a/c/home/projects', pathMatch: 'full' },
        ],
      },
      {
        path: 'p',
        canActivate: [participantGuard],
        data: { breadcrumb: { skip: true } },
        children: [
          {
            path: ':projectId',
            data: { breadcrumb: { skip: true } },
            component: ProjectPageComponent,
            children: [
              {
                path: 'tasks',
                component: TasksPageComponent,
                data: { role: 'c', breadcrumb: 'Tasks' },
              },
              {
                path: 'milestones',
                data: { breadcrumb: 'Milestones' },
                component: MilestonesComponent,
                children: [
                  {
                    path: ':milestoneId',
                    // todo: do this in :projectId
                    data: { breadcrumb: { alias: 'milestoneId' } },
                    component: MilestoneInfoComponent,
                  },
                ],
              },
              {
                path: 'project',
                component: ProjectComponent,
                data: { breadcrumb: 'Project' },
                children: [
                  {
                    path: 'general',
                    data: { breadcrumb: 'General' },

                    component: GeneralComponent,
                  },
                  {
                    path: 'reports',
                    data: { breadcrumb: 'Reports' },

                    component: ReportsComponent,
                  },
                  {
                    path: 'danger-zone',
                    data: { breadcrumb: 'Danger Zone' },
                    component: DangerZoneComponent,
                  },
                  {
                    path: 'forms',
                    data: { role: 'c', breadcrumb: 'Forms' },

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
                        component: Form3Component,
                      },
                      {
                        path: '4',
                        component: FormComponent,
                      },
                    ],
                  },
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'general',
                  },
                ],
              },
              {
                path: 'consultations',
                component: ConsultationsComponent,
                data: { role: 'c', breadcrumb: 'Consultations' },
              },

              {
                path: '',
                component: RedirectComponent,
                // redirectTo: redirectToNewPath, pathMatch: 'full'
                data: { path: ['a', 'c', 'p'] },
              },
            ],
          },
          { path: '', redirectTo: '/a/c/home/projects', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: '/a/c/home/projects', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent },
    ],
  },
  {
    path: 't',
    canActivate: [authGuard, roleGuard('t')],
    data: { breadcrumb: 'Home' },
    children: [
      {
        path: 'home',
        component: HomePageComponent,
        data: { role: 't' },
        children: [
          {
            path: 'projects',

            // does not matter, is rendered in home component
            component: ProjectPageComponent,
          },
          {
            path: 'reports',
            component: ReportsComponent,
            // does not matter, is rendered in home component
          },

          { path: '', redirectTo: '/a/t/home/projects', pathMatch: 'full' },
        ],
      },
      {
        path: 'p',
        canActivate: [participantGuard],
        data: { breadcrumb: { skip: true } },
        children: [
          {
            path: ':projectId',
            data: { breadcrumb: { skip: true } },
            component: ProjectPageComponent,

            children: [
              {
                path: 'tasks',
                component: TasksPageComponent,
                data: { role: 't', breadcrumb: 'Tasks' },
              },
              {
                path: 'project',
                component: ProjectComponent,
                data: { breadcrumb: 'Project' },
                children: [
                  {
                    path: 'general',
                    data: { breadcrumb: 'General' },

                    component: GeneralComponent,
                  },
                  {
                    path: 'reports',
                    data: { breadcrumb: 'Reports' },

                    component: ReportsComponent,
                  },
                  {
                    path: 'danger-zone',
                    data: { breadcrumb: 'Danger Zone' },
                    component: DangerZoneComponent,
                  },
                  {
                    path: 'forms',
                    data: { role: 't', breadcrumb: 'Forms' },

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
                    pathMatch: 'full',
                    redirectTo: 'general',
                  },
                ],
              },
              {
                path: 'consultations',
                component: ConsultationsComponent,
                data: { role: 't', breadcrumb: 'Consultations' },
              },
              {
                path: 'milestones',
                data: { breadcrumb: 'Milestones' },
                component: MilestonesComponent,
                children: [
                  {
                    path: ':milestoneId',
                    // todo: do this in :projectId
                    data: { breadcrumb: { alias: 'milestoneId' } },
                    component: MilestoneInfoComponent,
                  },
                ],
              },
              {
                path: '',
                component: RedirectComponent,
                // redirectTo: redirectToNewPath, pathMatch: 'full'
                data: { path: ['a', 't', 'p'] },
              },
            ],
          },
          { path: '', redirectTo: '/a/t/home/projects', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: '/a/t/home/projects', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent },
    ],
  },
];

export default routes;
