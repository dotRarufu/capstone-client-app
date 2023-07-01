import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Tab, TabDefinition } from 'src/app/models/tab';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/project';
import { Subscription, filter, fromEvent, map } from 'rxjs';
import { TabsService } from 'src/app/services/tabs.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'HomeLayout',

  template: `
    <div class="flex flex-col gap-[1rem]">
      <div>
        <TopAppBar />
        <Tabs />
      </div>
      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
      >
        <ng-content />
      </div>
    </div>

    <Modal inputId="removeProjectModal">
      <div
        class="sm1:w-sm flex w-full flex-col items-center gap-6 rounded-[3px] border border-base-content/10 bg-base-100 p-4"
      >
        <h2 class="text-[18px] text-base-content">
          Are you sure you want to remove this project?
        </h2>
        <div class=" flex w-full">
          <button class=" btn-ghost btn w-1/2 text-error">No</button>
          <button
            (click)="removeProjectCard()"
            class="btn-ghost btn w-1/2 text-success"
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>

    <ngx-spinner
      bdColor="rgba(0, 0, 0, 0.8)"
      size="default"
      color="#fff"
      type="square-loader"
      [fullScreen]="true"
      ><p style="color: white">Loading...</p></ngx-spinner
    >
  `,
})
export class HomeLayoutComponent implements OnInit {
  @Input() modalProjectId = -1;
  @Input() tabs: TabDefinition[] = [];
  @Input() role = "";

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    public tabsService: TabsService
  ) {}

  ngOnInit() {
    // const tabs: TabDefinition[] = [
    //   {
    //     name: 'Title Analyzer',
    //     id: 'title-analyzer',
    //   },
    //   {
    //     name: 'Projects',
    //     id: 'projects',
    //   },
    // ];
    const child1 = this.route.snapshot.firstChild;

    if (child1 === null) throw new Error('impossible');

    const active = child1.url[0].path;
    this.tabsService.setTabs(this.tabs, [this.role, 'home'], active);
  }

  removeProjectCard() {
    const removeProject$ = this.projectService.removeProject(
      this.modalProjectId
    );

    removeProject$.subscribe({
      next: (res) => console.log('remove project:', res),
      complete: () => console.log('remove project complete'),
      error: (err) => console.log('removeProject error:', err),
    });
  }
}
