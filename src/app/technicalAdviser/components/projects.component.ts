import { Component, Input } from '@angular/core';
import { ProjectService } from '../../services/project.service'

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
        <h2 class="text-[24px] sm1:text-[32px]">Projects asd</h2>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="h-[2px] w-full bg-base-content/10"></div>
      <app-technical-adviser-accordion [projects]="projects"></app-technical-adviser-accordion>
      <app-technical-adviser-accordion [projects]="projects"></app-technical-adviser-accordion>
      <app-technical-adviser-accordion [projects]="projects"></app-technical-adviser-accordion>
    </div>
    </ng-container>
    <ng-container *ngIf="sideColumn">
    <div
      class="flex w-full flex-col gap-[1rem] sm2:w-[840px] md:w-full lg:w-full"
    >
      <div
        class="flex flex-col gap-2 sm1:flex-row sm1:items-center sm1:justify-between"
      >
        <h2 class="text-[24px] sm1:text-[32px]">Projects asd side</h2>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="h-[2px] w-full bg-base-content/10"></div>
      <div class="w-full flex flex-col justify-items-center gap-[24px] py-[1rem]">
      <app-technical-adviser-accordion [sideColumn]="true" [projects]="projects"></app-technical-adviser-accordion>
      <app-technical-adviser-accordion [sideColumn]="true" [projects]="projects"></app-technical-adviser-accordion>
      <app-technical-adviser-accordion [sideColumn]="true" [projects]="projects"></app-technical-adviser-accordion>
     
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
    this.projects = this.projectService.getProjects() 
  }

}
