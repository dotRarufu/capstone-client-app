import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TabDefinition } from 'src/app/models/tab';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ProjectService } from 'src/app/services/project.service';
import { TabsService } from 'src/app/services/tabs.service';
import { CommonModule } from '@angular/common';
import { TabsComponent } from '../../components/ui/tabs.component';

@Component({
  standalone: true,
  imports: [FeatherIconsModule, TabsComponent, CommonModule, RouterModule],
  template: `
    <div class="flex h-full w-full flex-col gap-[16px] overflow-y-clip sm1:overflow-y-visible">
      <div class="w-full">
        <tabs [isResponsive]="false" />
      </div>

      <div class="h-[calc(100vh-60px)] overflow-x-scroll relative">
        <router-outlet #myOutlet="outlet"/>
        <button
        [class.hidden]="!myOutlet.isActivated"
        (click)="downloadFile(anchor)"
        class="btn-ghost btn absolute bottom-0 right-0 gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
      >
        <i-feather class="text-base-content/70" name="download" />

      </button>
      </div>



    </div>

    <a
        class="hidden"
        #anchor
        [href]="projectService.formUrl$ | async"
        download
      ></a>
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
    const child1 = this.route.parent!.parent!.snapshot.firstChild;
    const active = child1?.url[0].path;
    const projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);
    const role: string = this.route.snapshot.data['role'];
    let route = [role, 'p', projectId.toString(), 'project', 'forms'];
    if (role !== 's') {
      route = ['a', role, 'p', projectId.toString(), 'project', 'forms'];
    }

    this.tabsService.setTabs(tabs, route, active);
  }

  downloadFile(anchor: HTMLAnchorElement) {
    anchor.click();
  }
}
