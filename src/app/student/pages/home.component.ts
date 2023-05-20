import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Tab } from 'src/app/models/tab';

@Component({
  template: `
    <div class="flex flex-col gap-[1rem]">
      <div>
        <app-top-app-bar></app-top-app-bar>
        <!-- TODO: use service instead of passing tabs data -->
        <app-tabs [tabs]="tabs"></app-tabs>
      </div>

      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
      >
        <div class="md:hidden">
          <app-student-title-analyzer
            *ngIf="checkPath('title-analyzer')"
          ></app-student-title-analyzer>
          <app-student-projects
            *ngIf="checkPath('projects')"
          ></app-student-projects>
        </div>

        <!-- desktop -->
        <div class=" hidden w-full gap-[1rem]  md:flex lg:w-[1040px]">
          <app-student-title-analyzer></app-student-title-analyzer>

          <div class=" w-[294px] flex-shrink-0  basis-[294px] ">
            <app-student-projects></app-student-projects>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  active: string = 'projects';
  search: string = '';
  tabs: Tab[] = [
    {
      name: 'Title Analyzer',
      id: 'title-analyzer',
      handler: () => {
        this.router.navigate(['s', 'home', 'title-analyzer']);

        this.tabs = this.tabs.map((tab) =>
          tab.id === 'title-analyzer'
            ? { ...tab, active: true }
            : { ...tab, active: false }
        );
      },
    },
    {
      name: 'Projects',
      id: 'projects',
      handler: () => {
        this.router.navigate(['s', 'home', 'projects']);

        this.tabs = this.tabs.map((tab) =>
          tab.id === 'projects'
            ? { ...tab, active: true }
            : { ...tab, active: false }
        );
      },
    },
  ];
  projects: {
    name: string;
    uid: string;
    description: string;
    members: string[];
  }[] = [];

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}
  path: string = '';

  ngOnInit() {
    this.projects = this.projectService.getProjects();

    this.route.data.subscribe((data) => {
      this.path = data['path'];
      console.log('path:', this.path);
    });
  }

  checkPath(path: string) {
    const a = this.path === path;
    console.log('this.path:', this.path, 'path:', path);

    return a;
  }
}

// todo: improve
// class="{{
//   active === 'dashboard'
//     ? 'outline-primary/50 outline outline-offset-8 outline-2 rounded-[3px]'
//     : ''
// }}"
