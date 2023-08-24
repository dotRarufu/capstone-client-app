import { Component, OnInit, inject } from '@angular/core';
import { TabDefinition } from 'src/app/models/tab';
import { fromEvent, map } from 'rxjs';
import { TabsService } from 'src/app/services/tabs.service';
import { CommonModule } from '@angular/common';
import { ResultComponent } from './result.component';
import { ProjectsComponent } from './projects-container.component';
import { ProjectCardComponent } from 'src/app/components/ui/project-card.component';
import { AddProjectModalComponent } from './add-project-modal.component';
import { TitleAnalyzerModalComponent } from './title-analyzer-modal.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TopAppBarComponent } from 'src/app/components/ui/top-app-bar.component';
import { TabsComponent } from 'src/app/components/ui/tabs.component';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { ActivatedRoute } from '@angular/router';
import { AdviserProjectsComponent } from './adviser-projects.component';
import { StudentTitleAnalyzerComponent } from './student-title-analyzer.component';
import { StudentProjectsComponent } from './student-projects.component';
import { SpinnerComponent } from 'src/app/components/spinner.component';
import { RemoveProjectModalComponent } from './remove-project-modal.component';
import { AdviserReportsComponent } from './adviser-reports.component';
import { ProjectsAccordionComponent } from './projects-accordion.component';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [
    CommonModule,
    ResultComponent,
    ProjectsComponent,
    ProjectCardComponent,
    AddProjectModalComponent,
    TitleAnalyzerModalComponent,
    NgxSpinnerModule,
    TopAppBarComponent,
    TabsComponent,
    ModalComponent,
    ProjectsAccordionComponent,
    AdviserProjectsComponent,
    StudentTitleAnalyzerComponent,
    StudentProjectsComponent,
    AdviserReportsComponent,
    SpinnerComponent,
    RemoveProjectModalComponent,
  ],
  template: `
    <div class="flex flex-col gap-[1rem]">
      <div>
        <top-app-bar />
        <tabs />
      </div>
      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
      >
        <div
          class=" flex w-full  gap-[1rem] sm2:justify-center md:w-full lg:w-[1040px]"
        >
          <adviser-projects
            *ngIf="
              (activeId === 'projects' || isDesktop) &&
              (role === 'c' || role === 't')
            "
          />

          <adviser-reports
            *ngIf="
              (activeId === 'reports' || isDesktop) &&
              (role === 'c' || role === 't')
            "
            [sideColumn]="true"
          />

          <student-title-analyzer
            *ngIf="(activeId === 'title-analyzer' || isDesktop) && role === 's'"
          />

          <student-projects
            *ngIf="(activeId === 'projects' || isDesktop) && role === 's'"
          />
        </div>
      </div>
    </div>

    <add-project-modal />
    <title-analyzer-modal />
    <remove-project-modal />
    <spinner />
  `,
})
export class HomePageComponent implements OnInit {
  tabsService = inject(TabsService);
  route = inject(ActivatedRoute);

  role = this.route.snapshot.data['role'];
  isDesktop = false;
  activeId = '';

  ngOnInit() {
    this.tabsService.activeId$.subscribe({
      next: (id) => (this.activeId = id),
    });

    this.watchWindowSize();
    this.setupTabs();
  }

  setupTabs() {
    const child1 = this.route.snapshot.firstChild;

    if (child1 === null) throw new Error('impossible');

    const active = child1.url[0].path;
    const routes = ['c', 't'].includes(this.role)
      ? ['a', this.role, 'home']
      : [this.role, 'home'];

    const studentTabs: TabDefinition[] = [
      {
        name: 'Title Analyzer',
        id: 'title-analyzer',
      },
      {
        name: 'Projects',
        id: 'projects',
      },
    ];

    const adviserTabs: TabDefinition[] = [
      {
        name: 'Projects',
        id: 'projects',
      },
      {
        name: 'Reports',
        id: 'reports',
      },
    ];

    const tabs = this.role === 's' ? studentTabs : adviserTabs;

    this.tabsService.setTabs(tabs, routes, active);
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
}
