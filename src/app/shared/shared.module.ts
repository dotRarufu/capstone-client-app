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
import { FeatherModule } from 'angular-feather';
import { ArrowLeft, Menu, List, Download, FileText, Trello, Trash, Users, Sidebar, Clipboard, Monitor } from 'angular-feather/icons';

const icons = {
  ArrowLeft,
  Menu,
  List,
  Download,
  FileText,
  Trello, Trash, Users, Sidebar, Clipboard, Monitor
};

@NgModule({
  declarations: [
    FormGeneratorComponent,
    TabsComponent,
    FormComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PdfViewerModule,
    NgxDocViewerModule,
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
  ],
})
export class SharedModule {}
