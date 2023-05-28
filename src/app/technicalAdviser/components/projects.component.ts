import { Component, Input } from '@angular/core';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-technical-adviser-projects',
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
              <i-feather class="text-base-content/70" name="search"></i-feather>
            </button>
          </div>
        </div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <app-technical-adviser-accordion
          [projects]="projects"
        ></app-technical-adviser-accordion>
        <app-technical-adviser-accordion
          [projects]="projects"
        ></app-technical-adviser-accordion>
        <app-technical-adviser-accordion
          [projects]="projects"
        ></app-technical-adviser-accordion>
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
              <i-feather class="text-base-content/70" name="search"></i-feather>
            </button>
          </div>
        </div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <div
          class="flex w-full flex-col justify-items-center gap-[24px] py-[1rem]"
        >
          <app-technical-adviser-accordion
            [sideColumn]="true"
            [projects]="projects"
          ></app-technical-adviser-accordion>
          <app-technical-adviser-accordion
            [sideColumn]="true"
            [projects]="projects"
          ></app-technical-adviser-accordion>
          <app-technical-adviser-accordion
            [sideColumn]="true"
            [projects]="projects"
          ></app-technical-adviser-accordion>
        </div>
      </div>
    </ng-container>
  `,
})
export class ProjectsComponent {
  search: string = '';
  projects: {
    name: string;
    uid: number;
    description: string;
    members: string[];
  }[] = [];
  @Input() sideColumn? = false;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.projects = this.projectService.getProjects();
  }
}
