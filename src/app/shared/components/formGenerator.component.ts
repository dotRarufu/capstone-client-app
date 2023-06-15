import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tab } from 'src/app/models/tab';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { getFileName } from 'src/app/utils/getFileName';
import { getRolePath } from 'src/app/utils/getRolePath';

@Component({
  template: `
    <div class="flex h-full flex-col gap-[16px] py-[32px]">
      <div class="flex justify-between ">
        <h1 class="text-[32px] text-base-content">Generate Form</h1>
        <a class="hidden" #anchor [href]="downloadUrl" download></a>
        <button
          (click)="downloadFile(anchor)"
          class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
        >
          <i-feather class="text-base-content/70" name="download" />
          Download
        </button>
      </div>

      <hr class="h-[2px] w-full border-base-content/10" />

      <div>
        <Tabs [tabs]="tabs" [isResponsive]="false" />
      </div>

      <div class="h-full w-full">
        <router-outlet />
      </div>
    </div>
  `,
})
export class FormGeneratorComponent implements OnInit {
  pdfSrc = signal(
    'https://iryebjmqurfynqgjvntp.supabase.co/storage/v1/object/public/chum-bucket/form_2_project_0.docx?t=2023-05-18T14%3A11%3A02.027Z'
  );
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
    private authService: AuthService,
    private projectService: ProjectService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.projectId = this.projectService.activeProjectIdSignal();
    this.projectService.formUrl$.subscribe((a) => {
      this.downloadUrl = a;
      this.filename = getFileName(a);
    });
  }

  navigateTo(id: string) {
    const user = this.authService.getCurrentUser();
    if (user != null) {
      // move this inside a pipe
      if (user.role_id === null) throw new Error('user has no role id');

      const rolePath = getRolePath(user.role_id);
      this.router.navigate([rolePath, 'project', this.projectId, 'forms', id]);
    }
  }

  downloadFile(anchor: HTMLAnchorElement) {
    anchor.click();
  }
}
