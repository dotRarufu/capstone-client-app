import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './pages/home.component';
import { AccordionComponent } from './components/accordion.component';
import { ProjectComponent } from './pages/project.component';
import { SideBarComponent } from './components/sidebar.component';
import { ProjectsComponent } from './components/projects.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
// import { NavigationRailComponent } from './components/navigationRail.component';
import { ConsultationsComponent } from './components/consultations.component';
import { ProjectCardComponent } from './components/projectCard.component';
import { TasksComponent } from './components/tasks.component';
import { ParticipantsComponent } from './components/participants.component';

@NgModule({
  declarations: [
    HomeComponent,
    ConsultationsComponent,
    AccordionComponent,
    ProjectCardComponent,
    // NavigationRailComponent,
    ProjectComponent,
    SideBarComponent,
    ProjectsComponent,
    TasksComponent,
    ParticipantsComponent,
  ],
  imports: [SharedModule, DragDropModule],
  exports: [HomeComponent, ProjectComponent],
})
export class TechnicalAdviserModule {}
