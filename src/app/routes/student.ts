import { Routes } from '@angular/router';
import { TitleAnalyzerComponent } from '../pages/home/title-analyzer.component';
import { TitleBuilderComponent } from '../pages/title-builder/title-builder.component';
import { TasksPageComponent } from '../pages/project/pages/tasks/tasks.component';
import { ProjectComponent } from '../pages/project/pages/project/project.component';
import { RedirectComponent } from '../components/redirect.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { FormGeneratorComponent } from '../pages/forms/form-generator.component';
import { ConsultationsComponent } from '../pages/project/pages/consultations/consultations.component';
import { participantGuard } from '../guards/participant.guard';
import { MilestonesComponent } from '../pages/project/pages/milestones/milestones.component';
import { GeneralComponent } from '../pages/project/pages/project/general.component';
import { DangerZoneComponent } from '../pages/project/pages/project/danger-zone.component';
import { MilestoneInfoComponent } from '../pages/project/pages/milestones/info.component';
import { ProjectReportsComponent } from '../pages/project/pages/project/reports.component';
import { HomePageComponent } from '../pages/home/home.component';
import { ProjectPageComponent } from '../pages/project/project.component';
import { FormComponent } from '../pages/forms/form.component';
import { Form3Component } from '../pages/forms/form-3.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
    data: { role: 's' },
    children: [
      {
        path: 'title-analyzer',
        component: TitleAnalyzerComponent,
      },
      {
        path: 'projects',
        component: ProjectPageComponent,
      },
      { path: '', redirectTo: '/s/home/title-analyzer', pathMatch: 'full' },
    ],
  },
  {
    path: 'title-builder',
    component: TitleBuilderComponent,
  },
  {
    path: 'p',
    canActivate: [participantGuard],
    data: { breadcrumb: { skip: true } },
    children: [
      {
        path: ':projectId',
        component: ProjectPageComponent,
        data: { breadcrumb: { skip: true } },
        children: [
          {
            path: 'tasks',
            component: TasksPageComponent,
            data: { role: 's', breadcrumb: 'Tasks' },
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

                component: ProjectReportsComponent,
              },
              {
                path: 'danger-zone',
                data: { breadcrumb: 'Danger Zone' },

                component: DangerZoneComponent,
              },
              {
                path: 'forms',
                data: { role: 's', breadcrumb: 'Forms' },

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
            data: { role: 's', breadcrumb: 'Consultations' },
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
            data: { path: ['s', 'p'] },
          },
        ],
      },
      { path: '', redirectTo: '/s/home/projects', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/s/home/title-analyzer', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

export default routes;
