import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Tab } from 'src/app/models/tab';

@Component({
  selector: 'app-home',
  template: `
    <div class="flex flex-col gap-[1rem]">
      <div>
        <app-top-app-bar></app-top-app-bar>
        <app-tabs [tabs]="tabs"></app-tabs>
      </div>

      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
      >
        <!-- projects -->
        <!-- <ng-container *ngIf="active === 'projects'"> -->
        <!-- <app-projects></app-projects> -->
        <!-- <div class="w-full bg-secondary block">test</div> -->
        <!-- <router-outlet></router-outlet> -->
        <!-- </ng-container> -->
        <!-- <div class="w-full bg-secondary">test</div> -->
        <div class="w-full sm2:flex sm2:justify-center md:hidden">
          <router-outlet></router-outlet>
        </div>
        <!-- dashboard -->
        <!-- <ng-container *ngIf="active === 'dashboard'">
          <div
            class="flex w-full flex-col gap-[1rem] sm2:w-[840px] md:hidden md:w-full lg:w-[1040px]"
          >
            <div
              class="gap-2 sm1:flex-row sm1:items-center sm1:justify-between"
            >
              <app-dashboard></app-dashboard>
            </div>
          </div>
        </ng-container> -->

        <!-- desktop -->
        <div class="hidden w-full gap-[1rem]  md:flex lg:w-[1040px]">
          <!-- projects -->
          <div class="w-full">
            <app-capstone-adviser-projects
              [sideColumn]="true"
            ></app-capstone-adviser-projects>
          </div>

          <div class=" w-[357px] flex-shrink-0  basis-[357px]">
            <!-- todo: do this in other comps, to reduce repetition of tags -->
            <app-dashboard [sideColumn]="true"></app-dashboard>
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
      name: 'projects',
      id: 'projects',
      handler: () => {
        this.router.navigate(['c', 'home', 'projects']);

        this.tabs = this.tabs.map((tab) =>
          tab.id === 'projects'
            ? { ...tab, active: true }
            : { ...tab, active: false }
        );
      },
    },
    {
      name: 'dashboard',
      id: 'dashboard',
      handler: () => {
        this.router.navigate(['c', 'home', 'dashboard']);

        this.tabs = this.tabs.map((tab) =>
          tab.id === 'dashboard'
            ? { ...tab, active: true }
            : { ...tab, active: false }
        );
      },
    },
  ];
  projects: {
    name: string;
    uid: number;
    description: string;
    members: string[];
  }[] = [];

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projects = this.projectService.getProjects();
  }
}

// todo: improve
// class="{{
//   active === 'dashboard'
//     ? 'outline-primary/50 outline outline-offset-8 outline-2 rounded-[3px]'
//     : ''
// }}"
