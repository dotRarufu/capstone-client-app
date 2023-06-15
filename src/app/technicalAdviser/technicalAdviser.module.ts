import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './pages/home.component';
import { TechnicalAdviserProjectComponent } from './pages/project.component';
import { SideBarComponent } from './components/sidebar.component';
import { TechnicalAdviserProjectsComponent } from './components/projects.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ConsultationsComponent } from './components/consultations.component';
import { ProjectCardComponent } from './components/projectCard.component';
import { TasksComponent } from './components/tasks.component';
import { ParticipantsComponent } from './components/participants.component';

@NgModule({
  declarations: [
    HomeComponent,
    ConsultationsComponent,
    ProjectCardComponent,
    TechnicalAdviserProjectComponent,
    SideBarComponent,
    TechnicalAdviserProjectsComponent,
    TasksComponent,
    ParticipantsComponent,
  ],
  imports: [SharedModule, DragDropModule],
  exports: [HomeComponent, TechnicalAdviserProjectComponent],
})
export class TechnicalAdviserModule {}
