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
import { HomeLayoutComponent } from 'src/app/layouts/home.component';
import { CommonModule } from '@angular/common';
import { TitleAnalyzerComponent } from '../components/title-analyzer.component';
import { ResultComponent } from './result.component';
import { ProjectsComponent } from '../components/projects.component';
import { ProjectCardComponent } from 'src/app/components/card/project-card.component';
import { AddProjectModalComponent } from '../components/modals/addProject.component';
import { TitleAnalyzerModalComponent } from '../components/modals/titleAnalyzer.component';

@Component({
  selector: 'StudentHome',
  standalone: true,
  imports: [
    HomeLayoutComponent,
    CommonModule,
    TitleAnalyzerComponent,
    ResultComponent,
    ProjectsComponent,
    ProjectCardComponent,
    AddProjectModalComponent,
    TitleAnalyzerModalComponent,
  ],
  template: `
    <HomeLayout [modalProjectId]="modalProjectId" role="s" [tabs]="tabs">
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
                  <ProjectCard
                    (removeProjectId)="removeProjectId($event)"
                    *ngFor="let project of projects()"
                    [project]="project"
                    role="s"
                  />
                </div>
              </Projects>
            </div>
          </ng-container>
        </div>
      </ng-container>
    </HomeLayout>

    <AddProjectModal />

    <TitleAnalyzerModal
      (alreadyHaveTitleEvent)="watchAlreadyHaveTitle($event)"
    />
  `,
})
export class StudentHomeComponent implements OnInit, OnDestroy {
  hasResult = false;
  isDesktop = false;
  search = '';
  alreadyHaveTitle = false;
  projectsSubscription: Subscription;
  projects: WritableSignal<Project[]> = signal([]);
  modalProjectId = -1;
  tabs: TabDefinition[] = [
    {
      name: 'Title Analyzer',
      id: 'title-analyzer',
    },
    {
      name: 'Projects',
      id: 'projects',
    },
  ];

  constructor(
    private projectService: ProjectService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public tabsService: TabsService
  ) {
    this.projectsSubscription = this.initializeProjects();
  }

  ngOnInit() {
    this.watchAnalyzerResult();
    this.watchWindowSize();
  }

  watchAlreadyHaveTitle(value: boolean) {
    this.alreadyHaveTitle = value;
  }

  initializeProjects() {
    const projects$ = this.projectService.getProjects();
    const subscription = projects$.subscribe({
      next: (projects) => {
        if (projects === null) {
          this.projects.set([]);
          this.spinner.show();

          return;
        }

        this.spinner.hide();
        this.projects.set(projects);
      },
      complete: () => console.log('getproject complete'),
    });

    return subscription;
  }

  watchWindowSize() {
    const windowResize$ = fromEvent(window, 'resize');
    this.isDesktop = window.innerWidth >= 1240;
    windowResize$.pipe(map((_) => window.innerWidth)).subscribe({
      next: (width) => {
        this.isDesktop = width >= 1240;
      },
    });
  }

  watchAnalyzerResult() {
    this.projectService.analyzerResult$.subscribe({
      next: (v) => {
        this.hasResult = !!v;
      },
      error: (err) => {
        this.toastr.error('Error occured while analyzing title');
      },
    });
  }

  removeProjectId(id: number) {
    this.modalProjectId = id;
  }

  ngOnDestroy(): void {
    this.projectsSubscription.unsubscribe();
  }
}
