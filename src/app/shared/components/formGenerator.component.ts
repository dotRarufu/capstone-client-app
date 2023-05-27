import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tab } from 'src/app/models/tab';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-form-generator',
  template: `
    <div class="flex h-full flex-col gap-[16px] py-[32px]">
      <div class="flex justify-between ">
        <h1 class="text-[32px] text-base-content">Generate Form</h1>
        <a class="hidden" #anchor  [href]="downloadUrl" download></a>
        <button
          (click)="downloadFile(anchor)"
          class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.1665 11.8332V6.83317H0.166504V5.1665H5.1665V0.166504H6.83317V5.1665H11.8332V6.83317H6.83317V11.8332H5.1665Z"
              fill="currentColor"
            />
          </svg>
         
          Download
        </button>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <div class="">
        <app-tabs [tabs]="tabs" [isResponsive]="false"></app-tabs>
      </div>

      <div class="w-full h-full">
        <router-outlet></router-outlet>
      </div>
    </div>

    
  `,
})
export class FormGeneratorComponent implements OnInit {
  pdfSrc = signal('https://iryebjmqurfynqgjvntp.supabase.co/storage/v1/object/public/chum-bucket/form_2_project_0.docx?t=2023-05-18T14%3A11%3A02.027Z');
  tabs: Tab[] = [
    {
      name: 'Form 1',
      id: '1',
      
      handler: () => {
        // todo: create wrapper for this
        // this.spinner.show();
        console.log('start loading');
        this.navigateTo('1');
        this.projectService.generateForm(1);

        this.tabs = this.tabs.map((tab) =>
          tab.id === '1' ? { ...tab, active: true } : { ...tab, active: false }
        );
      },
    },
    {
      name: 'Form 2',
      id: '2',
      handler: () => {
        // this.spinner.show();
        console.log('start loading');
        this.navigateTo('2');
        this.projectService.generateForm(2);

        this.tabs = this.tabs.map((tab) =>
          tab.id === '2' ? { ...tab, active: true } : { ...tab, active: false }
        );
      },
    },
    {
      name: 'Form 3',
      id: '3',
      handler: () => {
        this.spinner.show();
        console.log('start loading');
        this.navigateTo('3');
        this.projectService.generateForm(3);

        this.tabs = this.tabs.map((tab) =>
          tab.id === '3' ? { ...tab, active: true } : { ...tab, active: false }
        );
      },
    },
    {
      name: 'Form 4',
      id: '4',
      handler: () => {
        this.spinner.show();
        console.log('start loading');
        this.navigateTo('4');
        this.projectService.generateForm(4);
          // todo: add modal, loader
          // todo: form does not work, the api still requires time range
        this.tabs = this.tabs.map((tab) =>
          tab.id === '4' ? { ...tab, active: true } : { ...tab, active: false }
        );
      },
    },
  ];
  projectId = -1;
  filename = 'defaultfilename.docx';
  downloadUrl = 'default download url';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService, private spinner: NgxSpinnerService
  ) {}

  navigateTo(id: string) {
    this.router.navigate(['c', 'project', this.projectId, 'forms', id]);
  }

  ngOnInit(): void {
    this.projectId = this.projectService.activeProjectIdSignal();
    this.projectService.formUrl$.subscribe((a) => {
      this.downloadUrl = a;
      this.filename = getFileName(a);

    });

  }

  downloadFile(anchor: HTMLAnchorElement) {
    anchor.click();
    console.log('filename:', this.filename)
    console.log('download url:', this.downloadUrl)
  }
}

const getFileName = (text: string) => {
  const lastIndex = text.lastIndexOf('/');
  if (lastIndex !== -1) {
    const extractedText = text.substring(lastIndex + 1);
    return extractedText;
  }
  
  throw new Error('wip, unnamed file');
}