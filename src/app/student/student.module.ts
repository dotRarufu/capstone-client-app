import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './pages/home.component';
import { ProjectsComponent } from './components/projects.component';
import { TitleAnalyzerComponent } from './components/titleAnalyzer.component';
import { ResultComponent } from './pages/result.component';
import { SideBarComponent } from './components/sidebar.component';
import { ProjectComponent } from './pages/project.component';
import { ConsultationsComponent } from './components/consultations.component';
import { ProjectCardComponent } from './components/projectCard.component';
import { TasksComponent } from './components/tasks.component';
import { TitleBuilderComponent } from './components/titleBuilder.component';

@NgModule({
  declarations: [HomeComponent, ProjectsComponent, SideBarComponent, ProjectComponent, TitleAnalyzerComponent, ResultComponent,  ConsultationsComponent, ProjectCardComponent, TasksComponent, TitleBuilderComponent],
  imports: [SharedModule],
  exports: [HomeComponent],
})
export class StudentModule {}
