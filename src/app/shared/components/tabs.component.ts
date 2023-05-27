import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tab } from 'src/app/models/tab';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-tabs',
  template: `
    <div
      class="border-b md:border-none border-base-content/20 px-[1rem] py-1 sm1:px-[32px] sm2:px-0 "
    >
      <div
        [class.md:hidden]="isResponsive"
        class="mx-auto flex w-full flex-row  overflow-x-scroll sm1:overflow-x-visible sm2:w-[840px] "
      >
        <div
          *ngFor="let tab of tabs"
          (click)="tab.handler()"
          class="btn-link btn flex-grow font-normal text-base-content no-underline hover:no-underline"
        >
          <button
            [class.border-b-[2px]]="tab.active"
            [class.text-primary]="tab.active"
            [class.no-animation]="tab.active"
            class="mx-auto w-fit border-primary text-base capitalize   "
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
    </div>
  `,
})
// todo: fix the background of login at laptop breakpoint
export class TabsComponent implements OnInit {
  @Input() tabs: Tab[] = [];
  active: string = '';
  @Input() isResponsive?: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // this.router.navigate(['c', 'project', projectId, 'forms', '1']);
    // todo: fix tab is not in active color when user initially go to 'home' and does not specify a child path

    // todo: change all icons to use feather icons
    const a = this.route.data.subscribe(data => { 
      // this.active = data.
      // console.log('data:', data['activeTab']);
    });

    // const lastIndex = this.route.snapshot.url.length - 1;
    // console.log('lastIndex:', lastIndex);
    // console.log('url:', this.route.snapshot.url);

    // const paths = this.route.snapshot.url.map(item => item.path)
    // // todo: maybe use a service for this
    // const isInProjectPath = !paths.includes('home')

    // if (isInProjectPath) {
    //   const projectId = this.route.snapshot.['projectId'];

    //   console.log("projectId:",projectId);
    //   if (!projectId) throw Error('wip, project id missing');

    //   // defaults to form 1

    // }
    // const path = this.route.snapshot.url[lastIndex].toString();
    // this.active = path
    // console.log('active:', this.active);
  }
}
