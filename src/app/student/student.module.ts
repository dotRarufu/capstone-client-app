import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './pages/home.component';
import { ProjectsComponent } from './components/projects.component';
import { AccordionComponent } from './components/accordion.component';
import { TitleAnalyzerComponent } from './components/titleAnalyzer.component';
import { ResultComponent } from './pages/result.component';

@NgModule({
  declarations: [HomeComponent, ProjectsComponent, AccordionComponent, TitleAnalyzerComponent, ResultComponent],
  imports: [SharedModule],
  exports: [HomeComponent],
})
export class StudentModule {}
