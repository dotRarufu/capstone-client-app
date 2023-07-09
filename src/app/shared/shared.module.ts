import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGeneratorComponent } from './components/formGenerator.component';
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
  X,
  LogIn,
  Search,
  Home,
  UserCheck,
  CheckSquare,
  Move,
  Edit,
  XCircle,
  Calendar,
  Check,
  Slash,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Minus,
} from 'angular-feather/icons';
import { TopAppBarComponent } from './components/topAppBar.component';
import { ModalComponent } from './components/modals/modal.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { TaskCardComponent } from './components/cards/taskCard.component';
import { NgChartsModule } from 'ng2-charts';
import { RedirectComponent } from './components/redirect.component';
import { ReportsComponent } from './components/reports.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProfileComponent } from './components/profile.component';
import { ProfileViewComponent } from './components/profileView.component';
import { NavigationRailComponent } from './components/navigationRail.component';
import { ParticipantCardComponent } from './components/cards/participantCard.component';
import { ProjectsAccordionComponent } from './components/accordion/projects.component';
import { TodoAccordionComponent } from './components/accordion/todo.component';
import { ConsultationCardComponent } from './components/cards/consultationCard.component';
import { UnauthorizedComponent } from './components/unauthorized.component';
import { HomeLayoutComponent } from './layouts/home.component';
import { ProjectCardComponent } from './components/cards/projectCard.component';
import { ProjectLayoutComponent } from './layouts/project.component';
import { ConsultationModalComponent } from './components/modals/consultation.component';
import { TaskDetailsModalComponent } from './components/modals/taskDetails.component';
import { AddTaskModalComponent } from './components/modals/addTask.component';
import { ParticipantsPageComponent } from './pages/participants.component';
import { ProjectsPageComponent } from './pages/projects.component';
import { TasksPageComponent } from './pages/tasks.component';
import { AccomplishmentsComponent } from './components/modals/accomplishments.component';

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
  X,
  LogIn,
  Search,
  Slash,
  Home,
  UserCheck,
  CheckSquare,
  Move,
  Edit,
  XCircle,
  Check,
  Calendar,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Minus,
};

@NgModule({
  declarations: [
    FormGeneratorComponent,
    TabsComponent,
    FormComponent,
    NotFoundComponent,
    TopAppBarComponent,
    ModalComponent,
    AccordionComponent,
    ProjectsAccordionComponent,
    TodoAccordionComponent,
    TaskCardComponent,
    RedirectComponent,
    ReportsComponent,
    ProfileComponent,
    ProfileViewComponent,
    NavigationRailComponent,
    ParticipantCardComponent,
    ConsultationCardComponent,
    UnauthorizedComponent,
    HomeLayoutComponent,
    ProjectCardComponent,
    ProjectLayoutComponent,
    ConsultationModalComponent,
    TaskDetailsModalComponent,
    AddTaskModalComponent,
    ParticipantsPageComponent,
    ProjectsPageComponent,
    TasksPageComponent,
    AccomplishmentsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxDocViewerModule,
    DragDropModule,
    NgChartsModule,
    FeatherModule.pick(icons),
    NgxSpinnerModule,
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
    ModalComponent,
    AccordionComponent,
    TaskCardComponent,
    NgChartsModule,
    RedirectComponent,
    ReportsComponent,
    DragDropModule,
    NgxSpinnerModule,
    ProfileComponent,
    ProfileViewComponent,
    NavigationRailComponent,
    ParticipantCardComponent,
    ProjectsAccordionComponent,
    TodoAccordionComponent,
    ConsultationCardComponent,
    UnauthorizedComponent,
    HomeLayoutComponent,
    ProjectCardComponent,
    ProjectLayoutComponent,
    ConsultationModalComponent,
    TaskDetailsModalComponent,
    AddTaskModalComponent,
    ParticipantsPageComponent,
    ProjectsPageComponent,
    TasksPageComponent,
    AccomplishmentsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
