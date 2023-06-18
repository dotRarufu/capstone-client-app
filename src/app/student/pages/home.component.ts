import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Tab } from 'src/app/models/tab';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/project';

@Component({
  template: `
    <div class="flex flex-col gap-[1rem]">
      <div>
        <TopAppBar />
        <Tabs [tabs]="tabs" />
      </div>

      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
      >
        <!-- mobile -->
        <div class="w-full md:hidden">
          <router-outlet />
        </div>

        <!-- desktop -->
        <div class=" hidden w-full gap-[1rem]  md:flex lg:w-[1040px]">
          <div class="flex flex-col gap-4">
            <ng-container *ngIf="!hasResult">
              <TitleAnalyzer (analyzeClicked)="this.alreadyHaveTitle = true" />
            </ng-container>

            <ng-container *ngIf="hasResult">
              <TitleAnalyzerResult [sideColumn]="true" />
            </ng-container>
          </div>

          <div class=" w-[294px] flex-shrink-0  basis-[294px] ">
            <Projects [sideColumn]="true" />
          </div>
        </div>
      </div>
    </div>

    <Modal
      inputId="title-analyzer"
      (checkboxChanged)="handleCheckboxChange($event)"
    >
      <div class="flex w-[712px] flex-col gap-[16px] bg-base-100 p-6">
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
            class="textarea-bordered textarea h-[136px] rounded-[3px] border-base-content/50 text-base  text-base-content placeholder:text-base-content/70"
            placeholder="Development and Evaluation of ..."
          ></textarea>

          <div class="flex">
            <!-- todo: maybe we can set the default border in daisy ui config -->
            <label class="btn-ghost btn grow rounded-[3px]" for="title-analyzer"
              >Cancel</label
            >
            <label
              for="title-analyzer"
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
            <button (click)="nextBlock()" class="btn-link btn w-fit">
              I already have a title
            </button>
            <label
              for="title-analyzer"
              (click)="toTitleBuilder()"
              class="btn-link btn w-fit text-base-content no-underline"
            >
              I don't have a title yet
            </label>
          </div>
        </ng-container>
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
export class HomeComponent implements OnInit {
  active = 'projects';
  alreadyHaveTitle = false;
  hasResult = false;
  // projects: Project[] = [];
  path: string = '';
  search = '';
  tabs: Tab[] = [
    {
      name: 'Title Analyzer',
      active: true,
      id: 'title-analyzer',
      handler: this.handlerFactory('title-analyzer'),
    },
    {
      name: 'Projects',
      id: 'projects',
      handler: this.handlerFactory('projects'),
    },
  ];
  titleFromAlreadyHaveTitle = '';

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.path = data['path'];
    });

    this.projectService.analyzerResult$.subscribe({
      next: (v) => {
        this.hasResult = !!v;
      },
      error: (err) => {
        this.toastr.error('Error occured while analyzing title');
      },
    });
  }

  handlerFactory(path: string) {
    return () => {
      this.router.navigate(['s', 'home', path]);

      this.tabs = this.tabs.map((tab) =>
        tab.id === path ? { ...tab, active: true } : { ...tab, active: false }
      );
    };
  }

  checkPath(path: string) {
    return this.path === path;
  }

  nextBlock() {
    this.alreadyHaveTitle = true;
  }

  handleCheckboxChange(e: boolean) {
    this.alreadyHaveTitle = !e;
  }

  async navigateTo(path: string) {
    this.spinner.show();

    await this.projectService.analyzeTitle(this.titleFromAlreadyHaveTitle);
    this.spinner.hide();
    this.router.navigate(['s', 'home', path], {});
  }

  toTitleBuilder() {
    this.router.navigate(['s', 'title-builder']);
  }
}

// todo: improve
// class="{{
//   active === 'dashboard'
//     ? 'outline-primary/50 outline outline-offset-8 outline-2 rounded-[3px]'
//     : ''
// }}"
