import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Tab, TabDefinition } from 'src/app/models/tab';
import { filter, fromEvent, map } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SectionProject } from 'src/app/models/sectionProject';
import { groupBySection } from 'src/app/utils/groupBySection';
import { TabsService } from 'src/app/services/tabs.service';

@Component({
  selector: 'TechnicalAdviserHome',
  template: `
    <!-- <div class="flex flex-col gap-[1rem]"> -->
    <HomeLayout [modalProjectId]="modalProjectId" role="t" [tabs]="tabs">
        <div
          class="w-full gap-[1rem] sm2:w-[840px]  md:flex md:w-full lg:w-[1040px]"
        >
          <ng-container *ngIf="active === 'projects' || isDesktop">
            <div class="w-full">
              <ProjectsPage>
                <ProjectsAccordion
                  *ngFor="let section of sections()"
                  [heading]="section.section"
                >
                  <ProjectCard
                    (removeProjectId)="removeProjectId($event)"
                    *ngFor="let project of section.projects"
                    [project]="project"
                    role="t"
                  />
                </ProjectsAccordion>
              </ProjectsPage>
            </div>
          </ng-container>

          <ng-container *ngIf="active === 'dashboard' || isDesktop">
            <div
              class="w-full sm2:flex sm2:justify-center md:flex-shrink-0  md:basis-[357px]"
            >
              <TechnicalAdviserDashboard />
            </div>
          </ng-container>
        </div>
      </HomeLayout>
    <!-- </div> -->
  `,
})
export class TechnicalAdviserHomeComponent implements OnInit {
  active: string = 'projects';
  search: string = '';
  tabs: TabDefinition[] = [
    {
      name: 'projects',
      id: 'projects',
    },
    {
      name: 'dashboard',
      id: 'dashboard',
    },
  ];
  isDesktop = false;
  sections: WritableSignal<SectionProject[]> = signal([]);
  modalProjectId = -1;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private tabsService: TabsService
  ) {}

  ngOnInit() {
    const windowResize$ = fromEvent(window, 'resize');
    this.isDesktop = window.innerWidth >= 1240;
    windowResize$.pipe(map((_) => window.innerWidth)).subscribe({
      next: (width) => {
        this.isDesktop = width >= 1240;
      },
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: (_) => {
          const a = this.route.firstChild;

          if (a === null) throw new Error('should be impossible');

          this.active = a.snapshot.url[0].path;
        },
      });

    const projects$ = this.projectService.getProjects();

    projects$.subscribe({
      next: (projects) => {
        if (projects === null) {
          this.sections.set([]);
          this.spinner.show();

          return;
        }
        this.spinner.hide();
        this.sections.set(groupBySection(projects));
      },
    });

    const tabs: TabDefinition[] = [
      {
        name: 'Dashboard',
        id: 'dashboard',
        // handler: this.handlerFactory('title-analyzer'),
      },
      {
        name: 'Projects',
        id: 'projects',
        // handler: this.handlerFactory('projects'),
      },
    ];
    const child1 = this.route.snapshot.firstChild;
    if (child1 === null) throw new Error('impossible');

    const active = child1.url[0].path;
    this.active = active;
    this.tabsService.setTabs(tabs, ['t', 'home'], active);
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

  navigateToProject(uid: number) {
    return () => {
      this.router.navigate(['t', 'project', uid]);
      this.projectService.activeProjectId.set(uid);
    };
  }
}
