import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../shared/components/notFound.component';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CapstoneAdviserConsultationsComponent } from './capstoneAdviser/consultations.component';
import { CapstoneAdviserReportsComponent } from './capstoneAdviser/reports.component';
import { CapstoneAdviserHomeComponent } from './capstoneAdviser/home.component';
import { CapstoneAdviserProjectComponent } from './capstoneAdviser/project.component';
import { CapstoneAdviserSideBarComponent } from './capstoneAdviser/sidebar.component';
import { TechnicalAdviserConsultationsComponent } from './technicalAdviser/consultations.component';
import { TechnicalAdviserReportsComponent } from './technicalAdviser/reports.component';
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
import { ScheduledConsultationModalComponent } from './technicalAdviser/scheduledModal.component';
import { ActualAccomplishmentsComponent } from './components/actualAccomplishments.component';
import { ProposedNextStepsComponent } from './components/proposedNextSteps.component';
import { NextDeliverablesComponent } from './components/nextDeliverables.component';
import { CompletedConsultationModalComponent } from './components/completedConsultationModal.component';

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
            component: CapstoneAdviserReportsComponent,
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
                path: 'reports',
                component: CapstoneAdviserReportsComponent,
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
            component: TechnicalAdviserReportsComponent,
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
                path: 'reports',
                component: TechnicalAdviserReportsComponent,
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
    CapstoneAdviserReportsComponent,
    CapstoneAdviserHomeComponent,
    CapstoneAdviserProjectComponent,
    CapstoneAdviserSideBarComponent,
    TechnicalAdviserConsultationsComponent,
    TechnicalAdviserReportsComponent,
    TechnicalAdviserHomeComponent,
    TechnicalAdviserProjectComponent,
    TechnicalAdviserSideBarComponent,
    ScheduledConsultationModalComponent,
    ActualAccomplishmentsComponent,
    ProposedNextStepsComponent,
    NextDeliverablesComponent,
    CompletedConsultationModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule,
    RouterModule.forChild(routes),
  ],
})
export class AdviserModule {}
