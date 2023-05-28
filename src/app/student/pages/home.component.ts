import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Tab } from 'src/app/models/tab';
import { NgxSpinnerService } from 'ngx-spinner';

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
        <div class="md:hidden w-full">
          <!-- <app-student-title-analyzer
            *ngIf="checkPath('title-analyzer')"
            (analyzeClicked)="this.alreadyHaveTitle = true"
          ></app-student-title-analyzer>
          <app-student-projects
            *ngIf="checkPath('projects')"
          ></app-student-projects> -->
          <router-outlet></router-outlet>
        </div>

        <!-- desktop -->
        <div class=" hidden w-full gap-[1rem]  md:flex lg:w-[1040px]">
          <div class="flex flex-col gap-4">
          <ng-container *ngIf="!hasResult">
          <app-student-title-analyzer
            (analyzeClicked)="this.alreadyHaveTitle = true"
          ></app-student-title-analyzer>
          </ng-container>
          <!-- check if there's a result, if there is, then hide title analyzer, else hide analyzer result -->
          <ng-container *ngIf="hasResult">
          <app-student-title-analyzer-result [sideColumn]="true"></app-student-title-analyzer-result>
          </ng-container>
          </div>


          <div class=" w-[294px] flex-shrink-0  basis-[294px] ">
            <app-student-projects [sideColumn]="true"></app-student-projects>
          </div>
        </div>
      </div>
    </div>

    <app-modal inputId="title-analyzer" (checkboxChanged)="alreadyHaveTitle = !$event">
      <div class="flex flex-col gap-[16px] p-6 bg-base-100 w-[712px]">
        <ng-container *ngIf="alreadyHaveTitle">
          <h1
            class="text-center text-[24px] text-base-content min-[444px]:text-left"
          >
            Enter your capstone project title
          </h1>
          <p class="text-base text-base-content/70">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea.
          </p>

          <textarea
            [(ngModel)]="titleFromAlreadyHaveTitle"
            class="rounded-[3px] textarea-bordered textarea h-[136px] border-base-content/50 text-base  text-base-content placeholder:text-base-content/70"
            placeholder="Development and Evaluation of ..."
          ></textarea>

          <div class="flex">
            <!-- todo: maybe we can set the default border in daisy ui config -->
            <label class="btn-ghost btn grow rounded-[3px]" for="title-analyzer"
              >Cancel</label
            >
            <label for="title-analyzer"
              (click)="navigateTo('title-analyzer-result')"
              class="btn-primary btn grow rounded-[3px]"
            >
              Next
            </label>
          </div>
        </ng-container>

        <ng-container *ngIf="!alreadyHaveTitle">
          <h1
            class="text-center text-[24px] text-base-content min-[444px]:text-left"
          >
            Title Analyzer
          </h1>
          <p class="text-base text-base-content/70">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea.
          </p>
          <div class="flex flex-col items-center gap-4 min-[444px]:items-end">
            <button
              (click)="alreadyHaveTitle = true"
              class="btn-link btn w-fit"
            >
              I already have a title
            </button>
            <button
              (click)="navigateTo('builder')"
              class="btn-link btn w-fit text-base-content no-underline"
            >
              I don't have a title yet
            </button>
          </div>
        </ng-container>
      </div>
    </app-modal>    


    <ngx-spinner bdColor = "rgba(0, 0, 0, 0.8)" size = "default" color = "#fff" type = "square-loader" [fullScreen] = "true"><p style="color: white" > Loading... </p></ngx-spinner>
  `,
})
export class HomeComponent implements OnInit {
  active = 'projects';
  search = '';
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
    uid: number;
    description: string;
    members: string[];
  }[] = [];
  alreadyHaveTitle = false;
  titleFromAlreadyHaveTitle = '';
  hasResult = false;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private route: ActivatedRoute, private spinner: NgxSpinnerService
  ) {}
  path: string = '';

  ngOnInit() {
    this.projects = this.projectService.getProjects();

    this.route.data.subscribe((data) => {
      this.path = data['path'];
      // console.log('path:', this.path);
    });

    this.projectService.analyzerResult$.subscribe(r => {
      this.hasResult = !!r;
      console.log('hasResult:', this.hasResult);
    });
  }

  checkPath(path: string) {
    const a = this.path === path;
    // console.log('this.path:', this.path, 'path:', path);
    console.log('alreadyHaveTitle:', this.alreadyHaveTitle)

    return a;
  }

  // todo maybe move in a service or not
  async navigateTo(path: string) {
    // todo: make the builder page under title analyzer route
    this.spinner.show();
    // if (path !== 'result') {
    //   this.router.navigate(['s', 'home', path]);
    //   return;
    // }
  

    console.log('analyze title');
    const titleAnalyzerResult = await this.projectService.analyzeTitle(
      this.titleFromAlreadyHaveTitle
    );
    console.log("passed state:", titleAnalyzerResult);
    this.spinner.hide();
    console.log('navigate');
    this.router.navigate(['s', 'home', path], {
      // state: { titleAnalyzerResult },
    });
  }
}

// todo: improve
// class="{{
//   active === 'dashboard'
//     ? 'outline-primary/50 outline outline-offset-8 outline-2 rounded-[3px]'
//     : ''
// }}"


