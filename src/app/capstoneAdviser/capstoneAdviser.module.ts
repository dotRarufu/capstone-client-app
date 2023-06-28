import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './pages/home.component';
import { CapstoneAdviserProjectComponent } from './pages/project.component';
import { SideBarComponent } from './components/sidebar.component';
import { CapstoneAdviserProjectsComponent } from './components/projects.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ConsultationsComponent } from './components/consultations.component';
import { ProjectCardComponent } from './components/projectCard.component';
import { TasksComponent } from './components/tasks.component';
import { ParticipantsComponent } from './components/participants.component';
import { ParticipantCardComponent } from './components/participantCard.component';
import { CapstoneAdviserDashboardComponent } from './components/dashboard.component';
import { DashboardComponent } from '../shared/components/dashboard.component';
import { FormGeneratorComponent } from '../shared/components/formGenerator.component';
import { FormComponent } from '../shared/components/form.component';
import { RedirectComponent } from '../shared/components/redirect.component';
import { NotFoundComponent } from '../shared/components/notFound.component';
import { RouterModule, Routes } from '@angular/router';
import { participantGuard } from '../guards/participant.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,

    children: [
      {
        path: 'projects',

        // does not matter, is rendered in home component
        component: CapstoneAdviserProjectComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        // does not matter, is rendered in home component
      },

      { path: '', redirectTo: '/c/home/projects', pathMatch: 'full' },
    ],
  },
  {
    path: 'project',
    // canActivate: [participantGuard],
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
            data: { path: ['c', 'project'] },
          },
        ],
      },
      { path: '', redirectTo: '/c/home/projects', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/c/home/projects', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  declarations: [
    HomeComponent,
    ConsultationsComponent,
    ProjectCardComponent,
    CapstoneAdviserProjectComponent,
    SideBarComponent,
    CapstoneAdviserProjectsComponent,
    TasksComponent,
    ParticipantsComponent,
    ParticipantCardComponent,
    CapstoneAdviserDashboardComponent,
  ],
  imports: [SharedModule, DragDropModule, RouterModule.forChild(routes)],
  exports: [HomeComponent, CapstoneAdviserProjectComponent],
})
export class CapstoneAdviserModule {}
