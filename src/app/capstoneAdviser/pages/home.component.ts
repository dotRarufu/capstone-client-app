import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Tab } from 'src/app/models/tab';
import { filter, fromEvent, map } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SectionProject } from 'src/app/models/sectionProject';
import { groupBySection } from 'src/app/utils/groupBySection';

@Component({
  selector: 'CapstoneAdviserHome',
  template: `
    <div class="flex flex-col gap-[1rem]">
      <div>
        <TopAppBar />
        <Tabs [tabs]="tabs" />
      </div>

      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
      >
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
                  <CapstoneAdviserProjectCard
                    (removeProjectId)="removeProjectId($event)"
                    *ngFor="let project of section.projects"
                    [project]="project"
                    [navigateTo]="navigateToProject(project.id)"
                  />
                </ProjectsAccordion>
              </Projects>
            </div>
          </ng-container>

          <ng-container *ngIf="active === 'dashboard' || isDesktop">
            <div
              class="w-full sm2:flex sm2:justify-center md:flex-shrink-0  md:basis-[357px]"
            >
              <CapstoneAdviserDashboard />
            </div>
          </ng-container>
        </div>
      </div>
    </div>

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
  `,
})
export class HomeComponent implements OnInit {
  active: string = 'projects';
  search: string = '';
  tabs: Tab[] = [
    {
      name: 'projects',
      active: true,
      id: 'projects',
      handler: this.handlerFactory('projects'),
    },
    {
      name: 'dashboard',
      id: 'dashboard',
      handler: this.handlerFactory('dashboard'),
    },
  ];
  isDesktop = false;
  sections: WritableSignal<SectionProject[]> = signal([]);
  modalProjectId = -1;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
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
  }

  handlerFactory(path: string) {
    return () => {
      this.router.navigate(['c', 'home', path]);

      this.tabs = this.tabs.map((tab) =>
        tab.id === path ? { ...tab, active: true } : { ...tab, active: false }
      );
    };
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
      this.router.navigate(['c', 'project', uid]);
      this.projectService.activeProjectId.set(uid);
    };
  }
}

// todo: improve
// class="{{
//   active === 'dashboard'
//     ? 'outline-primary/50 outline outline-offset-8 outline-2 rounded-[3px]'
//     : ''
// }}"
