import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGeneratorComponent } from './components/formGenerator.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TabsComponent } from './components/tabs.component';
import { NotFoundComponent } from './components/notFound.component';
import { FormComponent } from './components/form.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FeatherModule } from 'angular-feather';
import {
  ArrowLeft,
  Menu,
  List,
  Download,
  FileText,
  Trello,
  Trash,
  Users,
  Sidebar,
  Clipboard,
  Monitor,
  Plus,
  Zap,
  Heart,
  LogOut,
  User,
  X
} from 'angular-feather/icons';
import { TopAppBarComponent } from './components/topAppBar.component';
import { ProjectCardComponent } from './components/projectCard.component';
import { ModalComponent } from './components/modal.component';
import { AccordionComponent } from './components/accordion.component';
import { TaskCardComponent } from './components/taskCard.component';
import { TasksComponent } from './components/tasks.component';
import { ParticipantsComponent } from './components/participants.component';

const icons = {
  ArrowLeft,
  Menu,
  List,
  Download,
  FileText,
  Trello,
  Trash,
  Users,
  Sidebar,
  Clipboard,
  Monitor,
  Plus,
  Zap,
  Heart,
  LogOut,
  User,
  X
};

@NgModule({
  declarations: [
    FormGeneratorComponent,
    TabsComponent,
    FormComponent,
    NotFoundComponent,
    TopAppBarComponent,
    ProjectCardComponent,
    ModalComponent,
    AccordionComponent,
    TaskCardComponent,
    TasksComponent,
    ParticipantsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PdfViewerModule,
    NgxDocViewerModule,
    DragDropModule,
    FeatherModule.pick(icons),
  ],
  exports: [
    FormsModule,
    CommonModule,
    RouterModule,
    FormGeneratorComponent,
    NotFoundComponent,
    FormComponent,
    TabsComponent,
    FeatherModule,
    TopAppBarComponent,
    ProjectCardComponent,
    ModalComponent,
    AccordionComponent,
    TaskCardComponent,
    TasksComponent,
    ParticipantsComponent
  ],
})
export class SharedModule {}
