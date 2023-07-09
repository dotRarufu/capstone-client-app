import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabDefinition } from 'src/app/models/tab';
import { ProjectService } from 'src/app/services/project.service';
import { TabsService } from 'src/app/services/tabs.service';

@Component({
  template: `
    <div class="flex h-full flex-col gap-[16px] py-[32px]">
      <div class="flex justify-between ">
        <h1 class="text-[32px] text-base-content">Generate Form</h1>
        <a
          class="hidden"
          #anchor
          [href]="projectService.formUrl$ | async"
          download
        ></a>
        <button
          (click)="downloadFile(anchor)"
          class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
        >
          <i-feather class="text-base-content/70" name="download" />
          Download
        </button>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <div>
        <Tabs [isResponsive]="false" />
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

  constructor(
    public projectService: ProjectService,
    private tabsService: TabsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const tabs: TabDefinition[] = [
      {
        name: 'Form 1',
        id: '1',
      },
      {
        name: 'Form 2',
        id: '2',
      },
      {
        name: 'Form 3',
        id: '3',
      },
      {
        name: 'Form 4',
        id: '4',
      },
    ];
    const child1 = this.route.snapshot.firstChild;
    const active = child1?.url[0].path;
    const projectId = this.projectService.activeProjectId();
    const role: string = this.route.snapshot.data["role"];
    let route = [role, 'project', projectId.toString(), 'forms'];
    if (role !== "s") {
      route = ["a", role, 'project', projectId.toString(), 'forms'];
    }

    this.tabsService.setTabs(
      tabs,
      route,
      active
    );
  }

  downloadFile(anchor: HTMLAnchorElement) {
    anchor.click();
  }
}
