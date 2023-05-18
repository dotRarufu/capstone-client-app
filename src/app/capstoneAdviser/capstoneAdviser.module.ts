import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './pages/home.component';
import { TopAppBarComponent } from './components/topAppBar.component';
import { ProjectCardComponent } from './components/projectCard.component';
import { AccordionComponent } from './components/accordion.component';
import { DashboardComponent } from './components/dashboard.component';
import { NavigationRailComponent } from './components/navigationRail.component';
import { ProjectComponent } from './pages/project.component';
import { SideBarComponent } from './components/sidebar.component';
import { ProjectsComponent } from './components/projects.component';

@NgModule({
  declarations: [
    HomeComponent,
    TopAppBarComponent,
    ProjectCardComponent,
    AccordionComponent,
    DashboardComponent,
    NavigationRailComponent,
    ProjectComponent,
    SideBarComponent,
    ProjectsComponent,
  ],
  imports: [SharedModule],
  exports: [HomeComponent, ProjectComponent],
})
export class CapstoneAdviserModule {}
