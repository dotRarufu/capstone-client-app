import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentHomeComponent } from './pages/home.component';
import { TitleAnalyzerComponent } from './components/titleAnalyzer.component';
import { ProjectsComponent } from './components/projects.component';
import { ResultComponent } from './pages/result.component';
import { TitleBuilderComponent } from './components/titleBuilder.component';
import { StudentProjectComponent } from './pages/project.component';
import { DashboardComponent } from '../shared/components/dashboard.component';
import { TasksComponent } from './components/tasks.component';
import { ParticipantsComponent } from './components/participants.component';
import { ConsultationsComponent } from './components/consultations.component';
import { FormGeneratorComponent } from '../shared/components/formGenerator.component';
import { FormComponent } from '../shared/components/form.component';
import { RedirectComponent } from '../shared/components/redirect.component';
import { NotFoundComponent } from '../shared/components/notFound.component';
import { ParticipantCardComponent } from './components/participantCard.component';
import { ProjectCardComponent } from './components/projectCard.component';
import { SideBarComponent } from './components/sidebar.component';
import { SharedModule } from '../shared/shared.module';
import { participantGuard } from '../guards/participant.guard';

const routes: Routes = [
  {
    path: 'home',
    component: StudentHomeComponent,
    children: [
      {
        path: 'title-analyzer',
        component: TitleAnalyzerComponent,
      },
      {
        path: 'projects',
        component: ProjectsComponent,
      },
      {
        path: 'title-analyzer-result',
        component: ResultComponent,
      },

      { path: '', redirectTo: '/s/home/title-analyzer', pathMatch: 'full' },
    ],
  },
  {
    path: 'title-builder',
    component: TitleBuilderComponent,
  },
  {
    path: 'project',
    canActivate: [participantGuard],
    children: [
      {
        path: ':projectId',
        component: StudentProjectComponent,
        children: [
          {
            path: 'dashboard',
            component: DashboardComponent,
          },
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
            path: 'forms',
            component: FormGeneratorComponent,
            // redirectTo: '1',
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
            component: RedirectComponent,
            // redirectTo: redirectToNewPath, pathMatch: 'full'
            data: { path: ['s', 'project'] },
          },
        ],
      },
      { path: '', redirectTo: '/s/home/projects', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/s/home/title-analyzer', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  declarations: [
    StudentHomeComponent,
    ProjectsComponent,
    SideBarComponent,
    StudentProjectComponent,
    TitleAnalyzerComponent,
    ResultComponent,
    ConsultationsComponent,
    ProjectCardComponent,
    TasksComponent,
    TitleBuilderComponent,
    ParticipantsComponent,
    ParticipantCardComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [StudentHomeComponent],
})
export class StudentModule {}
