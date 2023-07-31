import { Routes } from '@angular/router';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';
import { participantGuard } from '../guards/participant.guard';
import { ParticipantsPageComponent } from './components/participants.component';
import { RedirectComponent } from '../components/redirect.component';
import { FormGeneratorComponent } from '../components/form/form-generator.component';
import { FormComponent } from '../components/form/form.component';
import { TasksComponent } from '../components/tasks.component';
import { ReportsComponent } from '../components/reports.component';
import { ConsultationsComponent } from '../components/consultations.component';
import { HomeComponent } from './pages/home.component';
import { ProjectPageComponent } from '../pages/project/project.component';
import { MilestonesComponent } from '../student/components/milestones.component';
import { GeneralComponent } from '../components/project/general.component';
import { DangerZoneComponent } from '../components/project/danger-zone.component';

const routes: Routes = [
  {
    path: 'c',
    canActivate: [authGuard, roleGuard('c')],
    data: { breadcrumb: 'Home' },
    children: [
      {
        path: 'home',
        data: { role: 'c' },
        component: HomeComponent,
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
            component: ProjectPageComponent,
            children: [
              {
                path: 'tasks',
                component: TasksComponent,
                data: { role: 'c', breadcrumb: 'Tasks' },
              },

              {
                path: 'project',
                component: ParticipantsPageComponent,
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
                        path: ':formNumber',
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
                data: { role: 'c', breadcrumb: 'Consultations' },
              },
              {
                path: 'milestones',
                component: MilestonesComponent,
                data: { breadcrumb: 'Milestones' },
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
        component: HomeComponent,
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
            component: ProjectPageComponent,

            children: [
              {
                path: 'tasks',
                component: TasksComponent,
                data: { role: 't', breadcrumb: 'Tasks' },
              },
              {
                path: 'project',
                component: ParticipantsPageComponent,
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
                        path: ':formNumber',
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
