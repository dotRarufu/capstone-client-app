import {
  Component,
  OnDestroy,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Tab, TabDefinition } from 'src/app/models/tab';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/project';
import { Subscription, filter, fromEvent, map } from 'rxjs';
import { TabsService } from 'src/app/services/tabs.service';

@Component({
  selector: 'StudentHome',

  template: `
    <div class="flex flex-col gap-[1rem]">
      <div>
        <TopAppBar />
        <Tabs />
      </div>
      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
      >
      <ng-container *ngIf="tabsService.activeId$ | async as activeId">
      
        <div
          class=" flex w-full  gap-[1rem] sm2:justify-center md:w-full lg:w-[1040px]"
        >
          <ng-container *ngIf="activeId === 'title-analyzer' || isDesktop">
            <div class="flex flex-col gap-4 ">
              <ng-container *ngIf="!hasResult">
                <TitleAnalyzer
                  (analyzeClicked)="this.alreadyHaveTitle = true"
                />
              </ng-container>

              <ng-container *ngIf="hasResult">
                <TitleAnalyzerResult [sideColumn]="true" />
              </ng-container>
            </div>
          </ng-container>

          <ng-container *ngIf="activeId === 'projects' || isDesktop">
            <div
              class="w-full sm2:w-[840px] md:w-[294px]  md:flex-shrink-0 md:basis-[294px] lg:w-[1040px]"
            >
              <Projects>
                <div
                  class="grid grid-flow-row grid-cols-1 items-center justify-items-center gap-[24px]  sm1:grid-cols-2 sm1:justify-start sm2:grid-cols-3 md:flex md:flex-col md:items-center md:justify-center"
                >
                  <StudentProjectCard
                    (removeProjectId)="removeProjectId($event)"
                    *ngFor="let project of projects()"
                    [project]="project"
                  />
                </div>
              </Projects>
            </div>
          </ng-container>
        </div>
        </ng-container>
      </div>
    </div>

    <Modal inputId="addProject">
      <div
        class="flex w-[712px] flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between">
            <input
              type="text"
              [(ngModel)]="name"
              placeholder="Project Name"
              class="input w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 bg-primary px-3 py-2 text-[20px] text-primary-content placeholder:text-[20px] placeholder:text-primary-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0 "
            />
          </div>
        </div>
        <div class="flex bg-base-100">
          <div class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4">
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Description</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <textarea
              [(ngModel)]="fullTitle"
              class="textarea h-[117px] w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 leading-normal placeholder:text-base-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0"
              placeholder="Full Title"
            ></textarea>
          </div>
          <ul class=" flex w-[223px]  flex-col bg-neutral/20 p-0 ">
            <button
              (click)="addProject()"
              class="btn-ghost btn flex justify-end gap-2 rounded-[3px] text-base-content"
            >
              done
              <i-feather class="text-base-content/70" name="check-square" />
            </button>

            <div class="h-full"></div>

            <button
              class="btn-ghost btn flex justify-end gap-2 rounded-[3px] text-base-content"
            >
              close
              <i-feather class="text-base-content/70" name="x-circle" />
            </button>
          </ul>
        </div>
      </div>
    </Modal>

    <Modal
      inputId="titleAnalyzer"
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
            <button class="btn-ghost btn grow rounded-[3px] text-base-content">
              Cancel
            </button>
            <button
              onclick="titleAnalyzer.showModal()"
              (click)="navigateTo('title-analyzer-result')"
              class="btn-primary btn grow rounded-[3px]"
            >
              Next
            </button>
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
            <button
              onclick="titleAnalyzer.showModal()"
              (click)="toTitleBuilder()"
              class="btn-link btn w-fit text-base-content no-underline"
            >
              I don't have a title yet
            </button>
          </div>
        </ng-container>
      </div>
    </Modal>
    <Modal inputId="removeProjectModal">
      <div
        class="w-sm flex flex-col gap-6 rounded-[3px] border border-base-content/10 bg-base-100 p-4"
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
export class StudentHomeComponent implements OnInit, OnDestroy {
  alreadyHaveTitle = false;
  hasResult = false;
  isDesktop = false;
  path: string = '';
  search = '';
  fullTitle = '';
  name = '';
  titleFromAlreadyHaveTitle = '';
  projectsSubscription: Subscription;
  projects: WritableSignal<Project[]> = signal([]);
  modalProjectId = -1;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public tabsService: TabsService
  ) {
    const projects$ = this.projectService.getProjects();

    this.projectsSubscription = projects$.subscribe({
      next: (projects) => {
        if (projects === null) {
          this.projects.set([]);
          this.spinner.show();
          console.warn('projects is null, is loading');

          return;
        }
        this.spinner.hide();
        this.projects.set(projects);
        console.log('getprojects emit:', projects);
      },
      complete: () => console.log('getproject complete'),
    });
  }

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

    const windowResize$ = fromEvent(window, 'resize');
    this.isDesktop = window.innerWidth >= 1240;
    windowResize$.pipe(map((_) => window.innerWidth)).subscribe({
      next: (width) => {
        this.isDesktop = width >= 1240;
      },
    });

    const tabs: TabDefinition[] = [
      {
        name: 'Title Analyzer',
        id: 'title-analyzer',
        // handler: this.handlerFactory('title-analyzer'),
      },
      {
        name: 'Projects',
        id: 'projects',
        // handler: this.handlerFactory('projects'),
      },
    ];
    const child1 = this.route.snapshot.firstChild;
    if (child1 === null) throw new Error("impossible");

    const active = child1.url[0].path;
    this.tabsService.setTabs(tabs, ['s', 'home'], active);
  }

  removeProjectId(id: number) {
    this.modalProjectId = id;
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

  addProject() {
    // this.spinner.show();
    this.projectService.createProject(this.name, this.fullTitle).subscribe({
      next: (a) => {
        // this.spinner.hide();
        this.toastr.success('Project added successfully');
      },
    });
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

  ngOnDestroy(): void {
    this.projectsSubscription.unsubscribe();
  }
}

// todo: improve
// class="{{
//   active === 'dashboard'
//     ? 'outline-primary/50 outline outline-offset-8 outline-2 rounded-[3px]'
//     : ''
// }}"
