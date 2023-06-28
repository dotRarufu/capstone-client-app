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
import { ModalComponent } from './components/modal.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { TaskCardComponent } from './components/taskCard.component';
import { NgChartsModule } from 'ng2-charts';
import { RedirectComponent } from './components/redirect.component';
import { DashboardComponent } from './components/dashboard.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProfileComponent } from './components/profile.component';
import { ProfileViewComponent } from './components/profileView.component';
import { NavigationRailComponent } from './components/navigationRail.component';
import { ParticipantCardComponent } from './components/participantCard.component';
import { ProjectsAccordionComponent } from './components/accordion/projects.component';
import { TodoAccordionComponent } from './components/accordion/todo.component';
import { ConsultationCardComponent } from './components/consultationCard.component';
import { UnauthorizedComponent } from './components/unauthorized.component';

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
    DashboardComponent,
    ProfileComponent,
    ProfileViewComponent,
    NavigationRailComponent,
    ParticipantCardComponent,
    ConsultationCardComponent,
    UnauthorizedComponent,
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
    DashboardComponent,
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
