import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../shared/components/notFound.component';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CapstoneAdviserConsultationsComponent } from './capstoneAdviser/consultations.component';
import { CapstoneAdviserDashboardComponent } from './capstoneAdviser/dashboard.component';
import { CapstoneAdviserHomeComponent } from './capstoneAdviser/home.component';
import { CapstoneAdviserProjectComponent } from './capstoneAdviser/project.component';
import { CapstoneAdviserSideBarComponent } from './capstoneAdviser/sidebar.component';
import { TechnicalAdviserConsultationsComponent } from './technicalAdviser/consultations.component';
import { TechnicalAdviserDashboardComponent } from './technicalAdviser/dashboard.component';
import { TechnicalAdviserHomeComponent } from './technicalAdviser/home.component';
import { TechnicalAdviserProjectComponent } from './technicalAdviser/project.component';
import { TechnicalAdviserSideBarComponent } from './technicalAdviser/sidebar.component';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';
import { participantGuard } from '../guards/participant.guard';
import { TasksPageComponent } from '../shared/pages/tasks.component';
import { ParticipantsPageComponent } from '../shared/pages/participants.component';
import { FormGeneratorComponent } from '../shared/components/formGenerator.component';
import { FormComponent } from '../shared/components/form.component';
import { RedirectComponent } from '../shared/components/redirect.component';

const routes: Routes = [
  {
    path: 'c',
    canActivate: [authGuard, roleGuard],
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
            path: 'dashboard',
            component: CapstoneAdviserDashboardComponent,
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
                component: TasksPageComponent,
              },
              {
                path: 'participants',
                component: ParticipantsPageComponent,
              },
              {
                path: 'consultations',
                component: CapstoneAdviserConsultationsComponent,
              },
              {
                path: 'dashboard',
                component: CapstoneAdviserDashboardComponent,
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
    canActivate: [authGuard, roleGuard],
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
            path: 'dashboard',
            component: TechnicalAdviserDashboardComponent,
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
                component: TasksPageComponent,
              },
              {
                path: 'participants',
                component: ParticipantsPageComponent,
              },
              {
                path: 'consultations',
                component: TechnicalAdviserConsultationsComponent,
              },
              {
                path: 'dashboard',
                component: TechnicalAdviserDashboardComponent,
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

@NgModule({
  declarations: [
    CapstoneAdviserConsultationsComponent,
    CapstoneAdviserDashboardComponent,
    CapstoneAdviserHomeComponent,
    CapstoneAdviserProjectComponent,
    CapstoneAdviserSideBarComponent,
    TechnicalAdviserConsultationsComponent,
    TechnicalAdviserDashboardComponent,
    TechnicalAdviserHomeComponent,
    TechnicalAdviserProjectComponent,
    TechnicalAdviserSideBarComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule,
    RouterModule.forChild(routes),
  ],
})
export class AdviserModule {}
