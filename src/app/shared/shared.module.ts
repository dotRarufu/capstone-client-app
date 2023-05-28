import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
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
  ChevronLeft
} from 'angular-feather/icons';
import { TopAppBarComponent } from './components/topAppBar.component';
import { ModalComponent } from './components/modal.component';
import { AccordionComponent } from './components/accordion.component';
import { TaskCardComponent } from './components/taskCard.component';
import { ParticipantsComponent } from './components/participants.component';
import { NgChartsModule } from 'ng2-charts';
import { RedirectComponent } from './components/redirect.component';
import { DashboardComponent } from './components/dashboard.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ProfileComponent } from './components/profile.component';
import { ProfileViewComponent } from './components/profileView.component';
import { NavigationRailComponent } from './components/navigationRail.component';

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
  ChevronLeft
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
    TaskCardComponent,
    ParticipantsComponent,
    RedirectComponent,
    DashboardComponent,
    ProfileComponent,
    ProfileViewComponent,
    NavigationRailComponent,
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
    BrowserAnimationsModule,
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
    ParticipantsComponent,
    NgChartsModule,
    RedirectComponent,
    DashboardComponent,
    DragDropModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ProfileComponent,
    ProfileViewComponent,
    NavigationRailComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
