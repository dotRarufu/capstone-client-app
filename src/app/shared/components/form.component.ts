import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Tab } from 'src/app/models/tab';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-form-generator',
  template: `
    <div class="flex h-full w-full justify-center ">
      <!-- <pdf-viewer
        [src]="pdfSrc"
        [render-text]="true"
        [original-size]="false"
        style="width: 100%; height: 100%; max-width: 840px;"
      ></pdf-viewer> -->
      <ngx-doc-viewer
        [url]="src"
        viewer="office"
        style="width:100%;height:100vh;"
      ></ngx-doc-viewer>
    </div>
  `,
})
export class FormComponent {
  src =
    'https://iryebjmqurfynqgjvntp.supabase.co/storage/v1/object/public/chum-bucket/form_2_project_0.docx?t=2023-05-18T14%3A11%3A02.027Z';

  constructor(private projectService: ProjectService) {
    this.projectService.formUrl$.subscribe((url) => (this.src = url));
  }
}