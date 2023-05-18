import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGeneratorComponent } from './components/formGenerator.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TabsComponent } from './components/tabs.component';
import { NotFoundComponent } from './components/notFound.component';
import { FormComponent } from './components/form.component';

@NgModule({
  declarations: [FormGeneratorComponent, TabsComponent, FormComponent, NotFoundComponent],
  imports: [CommonModule, FormsModule, RouterModule, PdfViewerModule],
  exports: [
    FormsModule,
    CommonModule,
    RouterModule,
    FormGeneratorComponent,
    NotFoundComponent,
    FormComponent,
    TabsComponent
  ],
})
export class SharedModule {}
