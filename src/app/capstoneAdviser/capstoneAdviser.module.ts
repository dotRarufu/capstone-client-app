import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './pages/home.component';
import { AccordionComponent } from './components/accordion.component';
import { DashboardComponent } from './components/dashboard.component';
import { NavigationRailComponent } from './components/navigationRail.component';
import { ProjectComponent } from './pages/project.component';
import { SideBarComponent } from './components/sidebar.component';
import { ProjectsComponent } from './components/projects.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    HomeComponent,
 
    AccordionComponent,
    DashboardComponent,
    NavigationRailComponent,
    ProjectComponent,
    SideBarComponent,
    ProjectsComponent,
  ],
  imports: [SharedModule, DragDropModule],
  exports: [HomeComponent, ProjectComponent],
})
export class CapstoneAdviserModule {}
