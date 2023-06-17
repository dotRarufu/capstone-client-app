import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './pages/home.component';
import {  CapstoneAdviserProjectComponent } from './pages/project.component';
import { SideBarComponent } from './components/sidebar.component';
import { CapstoneAdviserProjectsComponent } from './components/projects.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ConsultationsComponent } from './components/consultations.component';
import { ProjectCardComponent } from './components/projectCard.component';
import { TasksComponent } from './components/tasks.component';
import { ParticipantsComponent } from './components/participants.component';
import { ParticipantCardComponent } from './components/participantCard.component';

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
    ParticipantCardComponent
  ],
  imports: [SharedModule, DragDropModule],
  exports: [HomeComponent,  CapstoneAdviserProjectComponent],
})
export class CapstoneAdviserModule {}
