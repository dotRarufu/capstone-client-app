import { Component } from '@angular/core';
import { ProjectService } from '../../services/project.service'

@Component({
  selector: 'app-projects',
  template: `
    <div
      class="flex w-full flex-col gap-[1rem] sm2:w-[840px]  md:w-full lg:w-[1040px]"
    >
      <div
        class="flex flex-col gap-2 sm1:flex-row sm1:items-center sm1:justify-between"
      >
        <h2 class="text-2xl">Projects</h2>
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
      <app-accordion [projects]="projects"></app-accordion>
      <app-accordion [projects]="projects"></app-accordion>
      <app-accordion [projects]="projects"></app-accordion>
    </div>
    <!-- <div class="w-full bg-secondary">test</div> -->
  `,
})
export class ProjectsComponent {
  search: string = '';
  projects: {
    name: string;
    uid: string;
    description: string;
    members: string[];
  }[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.projects = this.projectService.getProjects() 
  }

}
