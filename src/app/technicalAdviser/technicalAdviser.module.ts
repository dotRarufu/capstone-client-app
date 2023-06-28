import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TechnicalAdviserHomeComponent } from './pages/home.component';
import { TechnicalAdviserProjectComponent } from './pages/project.component';
import { SideBarComponent } from './components/sidebar.component';
import { TechnicalAdviserProjectsComponent } from './components/projects.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ConsultationsComponent } from './components/consultations.component';
import { ProjectCardComponent } from './components/projectCard.component';
import { TasksComponent } from './components/tasks.component';
import { ParticipantsComponent } from './components/participants.component';
import { ParticipantCardComponent } from './components/participantCard.component';
import { TechnicalAdviserDashboardComponent } from './components/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../shared/components/dashboard.component';
import { FormGeneratorComponent } from '../shared/components/formGenerator.component';
import { FormComponent } from '../shared/components/form.component';
import { RedirectComponent } from '../shared/components/redirect.component';
import { NotFoundComponent } from '../shared/components/notFound.component';
import { participantGuard } from '../guards/participant.guard';

const routes: Routes = [
  {
    path: 'home',
    component: TechnicalAdviserHomeComponent,

    children: [
      {
        path: 'projects',
        component: TechnicalAdviserProjectsComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },

      { path: '', redirectTo: '/t/home/projects', pathMatch: 'full' },
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
            component: ParticipantsComponent,
          },
          {
            path: 'consultations',
            component: ConsultationsComponent,
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
            data: { path: ['t', 'project'] },
          },
        ],
      },
      { path: '', redirectTo: '/t/home/projects', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/t/home/projects', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  declarations: [
    TechnicalAdviserHomeComponent,
    ConsultationsComponent,
    ProjectCardComponent,
    TechnicalAdviserProjectComponent,
    SideBarComponent,
    TechnicalAdviserProjectsComponent,
    TasksComponent,
    ParticipantsComponent,
    ParticipantCardComponent,
    TechnicalAdviserDashboardComponent,
  ],
  imports: [SharedModule, DragDropModule, RouterModule.forChild(routes)],
  exports: [TechnicalAdviserHomeComponent, TechnicalAdviserProjectComponent],
})
export class TechnicalAdviserModule {}
