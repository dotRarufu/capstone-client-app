import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './pages/home.component';
import { TopAppBarComponent } from './components/topAppBar.component';
import { TabsComponent } from './components/tabs.component';
import { ProjectCardComponent } from './components/projectCard.component';
import { AccordionComponent } from './components/accordion.component';
import { DashboardComponent } from './components/dashboard.component';

@NgModule({
  declarations: [
    HomeComponent,
    TopAppBarComponent,
    TabsComponent,
    ProjectCardComponent,
    AccordionComponent,
    DashboardComponent,
  ],
  imports: [SharedModule],
  exports: [HomeComponent],
})
export class CapstoneAdviserModule {}
