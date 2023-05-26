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
          <div class="flex flex-grow flex-col gap-[1rem] ">
            <div
              class="flex flex-col gap-2 sm1:flex-row sm1:items-center sm1:justify-between"
            >
              <h2 class="text-2xl">Projects</h2>
              <div
                class="input-group rounded-[3px] border border-base-content/50 sm1:max-w-[371px]"
              >
                <input
                  type="text"
                  placeholder="Search"
                  [(ngModel)]="search"
                  class="input w-full rounded-[3px] px-3  py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70 focus:outline-0"
                />
                <button class="btn-ghost btn hover:rounded-[3px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex w-full flex-shrink flex-col gap-[16px]">
              <app-accordion [projects]="projects"></app-accordion>
              <app-accordion [projects]="projects"></app-accordion>
              <app-accordion [projects]="projects"></app-accordion>
            </div>
          </div>

          <div class=" w-[357px] flex-shrink-0  basis-[357px] ">
            <app-dashboard></app-dashboard>
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
          tab.id === 'projects' ? { ...tab, active: true } : {...tab, active: false}
        );
      },
    },
    {
      name: 'dashboard',
      id: 'dashboard',
      handler: () => {
        this.router.navigate(['c', 'home', 'dashboard']);

        this.tabs = this.tabs.map((tab) =>
          tab.id === 'dashboard' ? { ...tab, active: true } : {...tab, active: false}
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
