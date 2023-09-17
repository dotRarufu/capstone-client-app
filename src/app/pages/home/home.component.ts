import { Component, OnInit, inject } from '@angular/core';
import { TabDefinition } from 'src/app/models/tab';
import { filter, fromEvent, map, switchMap, tap } from 'rxjs';
import { TabsService } from 'src/app/services/tabs.service';
import { CommonModule } from '@angular/common';
import { ResultComponent } from './result.component';
import { ProjectsComponent } from './projects-container.component';
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
import { AddProjectModalComponent } from './add-project-modal.component';
import { ScheduledConsultationsComponent } from './scheduled-consultations.component';
import { AuthService } from 'src/app/services/auth.service';
import { isNotNull } from 'src/app/utils/isNotNull';
import { ConsultationService } from 'src/app/services/consultation.service';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [
    CommonModule,
    ResultComponent,
    ProjectsComponent,
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
    AddProjectModalComponent,
    ScheduledConsultationsComponent
  ],
  template: `
    <div class="flex flex-col gap-[1rem]">
      <div>
        <top-app-bar />
        <tabs />
      </div>
      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
        *ngIf="{ activeId: activeId$ | async } as observables"
      >
        <div
          class=" flex w-full justify-center gap-[1rem] md:w-full lg:w-[1040px]"
        >
          <div
            class="w-full sm2:w-[840px]  md:w-full lg:w-[1040px] flex flex-col gap-8"
            *ngIf="
              (observables.activeId === 'projects' || isDesktop) &&
              (role === 'a')
            "
          >
            <adviser-projects />
            <scheduled-consultations *ngIf="hasScheduledConsultation$ | async"/>
          </div>

          <div
            class="w-full sm2:w-[840px] md:w-[294px] md:flex-shrink-0 md:basis-[294px] lg:w-[1040px]"
            *ngIf="
              (observables.activeId === 'reports' || isDesktop) &&
              (role === 'a')
            "
          >
            <adviser-reports [sideColumn]="true" />
          </div>

          <div
            class="w-full sm2:w-[840px] md:w-full lg:w-[1040px]"
            *ngIf="
              (observables.activeId === 'title-analyzer' || isDesktop) &&
              role === 's'
            "
          >
            <student-title-analyzer />
          </div>

          <div
            class="w-full sm2:w-[840px] md:w-[294px] md:flex-shrink-0 md:basis-[294px] lg:w-[1040px]"
            *ngIf="
              (observables.activeId === 'projects' || isDesktop) && role === 's'
            "
          >
            <student-projects />
          </div>
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
  authService = inject(AuthService);
  consultationService = inject(ConsultationService);
  hasScheduledConsultation$ = this.consultationService.checkHasScheduledConsultation()

  role = this.route.snapshot.data['role'];
  isDesktop = false;
  activeId$ = this.tabsService.activeId$;

  ngOnInit() {
    this.watchWindowSize();
    this.setupTabs();
    console.log('role:', this.role);
  }

  setupTabs() {
    const child1 = this.route.snapshot.firstChild;

    if (child1 === null) throw new Error('impossible');

    const active = child1.url[0].path;
    const routes = ['a'].includes(this.role)
      ? [this.role, 'home']
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
