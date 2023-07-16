import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Tab, TabDefinition } from 'src/app/models/tab';
import { filter, fromEvent, map } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SectionProject } from 'src/app/models/sectionProject';
import { groupBySection } from 'src/app/utils/groupBySection';
import { TabsService } from 'src/app/services/tabs.service';
import { CommonModule } from '@angular/common';
import { HomeLayoutComponent } from 'src/app/layouts/home.component';
import { ProjectsAccordionComponent } from 'src/app/components/accordion/projects.component';
import { ProjectCardComponent } from 'src/app/components/card/project-card.component';
import { ProjectsComponent } from '../components/projects.component';
import { ReportsComponent } from 'src/app/components/reports.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    HomeLayoutComponent,
    ProjectsAccordionComponent,
    ProjectCardComponent,
    ReportsComponent,
    ProjectsComponent,
  ],
  selector: 'Home',
  template: `
    <HomeLayout [modalProjectId]="modalProjectId" [role]="role" [tabs]="tabs">
      <div
        class="w-full gap-[1rem] sm2:w-[840px]  md:flex md:w-full lg:w-[1040px]"
      >
        <ng-container *ngIf="active === 'projects' || isDesktop">
          <div class="w-full">
            <Projects>
              <ProjectsAccordion
                *ngFor="let section of sections()"
                [heading]="section.section"
              >
                <ProjectCard
                  (removeProjectId)="removeProjectId($event)"
                  *ngFor="let project of section.projects"
                  [project]="project"
                  [role]="role"
                />
              </ProjectsAccordion>
            </Projects>
          </div>
        </ng-container>

        <ng-container *ngIf="active === 'reports' || isDesktop">
          <div
            class="w-full sm2:flex sm2:justify-center md:flex-shrink-0  md:basis-[357px]"
          >
            <Reports [sideColumn]="true" />
          </div>
        </ng-container>
      </div>
    </HomeLayout>
  `,
})
export class HomeComponent implements OnInit {
  active: string = 'projects';
  isDesktop = false;
  sections: WritableSignal<SectionProject[]> = signal([]);
  modalProjectId = -1;
  tabs: TabDefinition[] = [
    {
      name: 'Reports',
      id: 'reports',
    },
    {
      name: 'Projects',
      id: 'projects',
    },
  ];
  role = this.route.snapshot.data['role'];

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    const child1 = this.route.snapshot.firstChild;
    if (child1 === null) throw new Error('impossible');

    this.active = child1.url[0].path;
  }

  ngOnInit() {
    this.watchWindowSize();
    this.watchActivePath();
    this.setupProjects();
  }

  setupProjects() {
    const projects$ = this.projectService.getProjects();

    projects$.subscribe({
      next: (projects) => {
        console.log('projects$ emits');
        if (projects === null) {
          this.sections.set([]);
          this.spinner.show();

          return;
        }
        this.spinner.hide();
        this.sections.set(groupBySection(projects));
      },
      complete: () => console.log('projects$ complete'),
      error: () => console.log('projects$ errored'),
    });
  }

  watchActivePath() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: (_) => {
          const a = this.route.firstChild;

          if (a === null) throw new Error('should be impossible');

          this.active = a.snapshot.url[0].path;
        },
      });
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

  removeProjectId(id: number) {
    this.modalProjectId = id;
  }
}
