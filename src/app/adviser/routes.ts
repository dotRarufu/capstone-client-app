import { Routes } from '@angular/router';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { CapstoneAdviserHomeComponent } from './capstoneAdviser/home.component';
import { CapstoneAdviserProjectComponent } from './capstoneAdviser/project.component';
import { TechnicalAdviserHomeComponent } from './technicalAdviser/home.component';
import { TechnicalAdviserProjectComponent } from './technicalAdviser/project.component';
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

const routes: Routes = [
  {
    path: 'c',
    canActivate: [authGuard, roleGuard('c')],
    children: [
      {
        path: 'home',
        component: CapstoneAdviserHomeComponent,

        children: [
          {
            path: 'projects',

            // does not matter, is rendered in home component
            component: CapstoneAdviserProjectComponent,
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
        path: 'project',
        canActivate: [participantGuard],
        children: [
          {
            path: ':projectId',
            component: CapstoneAdviserProjectComponent,

            children: [
              {
                path: 'tasks',
                component: TasksComponent,
              },
              {
                path: 'participants',
                component: ParticipantsPageComponent,
              },
              {
                path: 'consultations',
                component: ConsultationsComponent,
                data: {role: "c"}
              },
              {
                path: 'reports',
                component: ReportsComponent,
              },
              {
                path: 'forms',
                component: FormGeneratorComponent,
                data: { role: 'c' },

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
                data: { path: ['a', 'c', 'project'] },
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
    children: [
      {
        path: 'home',
        component: TechnicalAdviserHomeComponent,

        children: [
          {
            path: 'projects',

            // does not matter, is rendered in home component
            component: TechnicalAdviserProjectComponent,
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
        path: 'project',
        canActivate: [participantGuard],
        children: [
          {
            path: ':projectId',
            component: TechnicalAdviserProjectComponent,

            children: [
              {
                path: 'tasks',
                component: TasksComponent,
              },
              {
                path: 'participants',
                component: ParticipantsPageComponent,
              },
              {
                path: 'consultations',
                component: ConsultationsComponent,
                data: {role: "t"}

              },
              {
                path: 'reports',
                component: ReportsComponent,
              },
              {
                path: 'forms',
                component: FormGeneratorComponent,
                data: { role: 't' },
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
                data: { path: ['a', 't', 'project'] },
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
