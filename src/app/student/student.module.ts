import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './pages/home.component';
import { ProjectsComponent } from './components/projects.component';
import { AccordionComponent } from './components/accordion.component';
import { TitleAnalyzerComponent } from './components/titleAnalyzer.component';
import { ResultComponent } from './pages/result.component';
import { SideBarComponent } from './components/sidebar.component';
import { ProjectComponent } from './pages/project.component';
import { NavigationRailComponent } from './components/navigationRail.component';
import { ConsultationsComponent } from './components/consultations.component';
import { DashboardComponent } from './components/dashboard.component';

@NgModule({
  declarations: [HomeComponent, ProjectsComponent, AccordionComponent, SideBarComponent, ProjectComponent, TitleAnalyzerComponent, ResultComponent, NavigationRailComponent, ConsultationsComponent, DashboardComponent],
  imports: [SharedModule],
  exports: [HomeComponent],
})
export class StudentModule {}
