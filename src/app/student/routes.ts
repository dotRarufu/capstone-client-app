import { RouterModule, Routes } from '@angular/router';
import { StudentHomeComponent } from './pages/home.component';
import { TitleAnalyzerComponent } from './components/titleAnalyzer.component';
import { ProjectsComponent } from './components/projects.component';
import { ResultComponent } from './pages/result.component';
import { TitleBuilderComponent } from './components/titleBuilder.component';
import { StudentProjectComponent } from './pages/project.component';
import { ReportsComponent } from '../components/reports.component';
import { TasksComponent } from './components/tasks.component';
import { ParticipantsComponent } from './components/participants.component';
import { ConsultationsComponent } from './components/consultations.component';
import { RedirectComponent } from '../components/redirect.component';
import { NotFoundComponent } from '../pages/not-found/notFound.component';
import { FormGeneratorComponent } from '../components/form/formGenerator.component';
import { FormComponent } from '../components/form/form.component';

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
    // canActivate: [participantGuard],
    children: [
      {
        path: ':projectId',
        component: StudentProjectComponent,
        children: [
          {
            path: 'reports',
            component: ReportsComponent,
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
            data: { role: 's' },
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

export default routes;