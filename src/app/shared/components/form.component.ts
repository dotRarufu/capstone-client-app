import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tab } from 'src/app/models/tab';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-form-generator',
  template: `
    
      <div class="flex h-full w-full justify-center">
        <pdf-viewer
          [src]="pdfSrc"
          [render-text]="true"
          [original-size]="false"
          style="width: 100%; height: 100%; max-width: 840px;"
        ></pdf-viewer>
      </div>
   
  `,
})
export class FormComponent {
  pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  
}
