import { Component, Input, WritableSignal, signal } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from 'src/app/models/project';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { groupBySection } from '../../utils/groupBySection';
import { SectionProject } from 'src/app/models/sectionProject';



@Component({
  selector: 'Projects',
  template: `
    <ng-container *ngIf="!sideColumn">
      <div
        class="flex w-full flex-col gap-[1rem] sm2:w-[840px] md:w-full lg:w-full "
      >
        <div
          class="flex flex-col gap-2 sm1:flex-row sm1:items-center sm1:justify-between"
        >
          <h2 class="text-[24px] sm1:text-[32px]">Projects</h2>
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
              <i-feather class="text-base-content/70" name="search" />
            </button>
          </div>
        </div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <ProjectsAccordion
            *ngFor="let section of sections()"
            [heading]="section.section"
          >
            <CapstoneAdviserProjectCard
              sideColumn
              *ngFor="let project of section.projects"
              [project]="project"
              [navigateTo]="navigateToProject(project.id)"
            />
          </ProjectsAccordion>
      </div>
    </ng-container>

    <ng-container *ngIf="sideColumn">
      <div
        class="flex w-full flex-col gap-[1rem] sm2:w-[840px] md:w-full lg:w-full"
      >
        <div
          class="flex flex-col gap-2 sm1:flex-row sm1:items-center sm1:justify-between"
        >
          <h2 class="text-[24px] sm1:text-[32px]">Projects</h2>
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
              <i-feather class="text-base-content/70" name="search" />
            </button>
          </div>
        </div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <div class="flex w-full flex-col justify-items-center gap-[24px] ">
          <ProjectsAccordion
            *ngFor="let section of sections()"
            [heading]="section.section"
          >
            <CapstoneAdviserProjectCard
              sideColumn
              *ngFor="let project of section.projects"
              [project]="project"
              [navigateTo]="navigateToProject(project.id)"
            />
          </ProjectsAccordion>
         
        </div>
      </div>
    </ng-container>
  `,
})
export class CapstoneAdviserProjectsComponent {
  search: string = '';
  // projects: WritableSignal<Project[]
  // > = signal([]);
  @Input() sideColumn? = false;
  sections: WritableSignal<SectionProject[]> = signal([]);

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
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

  navigateToProject(uid: number) {
    return () => {
      this.router.navigate(['c', 'project', uid]);
      this.projectService.activeProjectIdSignal.set(uid);
    };
  }
}
