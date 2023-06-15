import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { Tab } from 'src/app/models/tab';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'Projects',
  template: `
    <ng-container *ngIf="!sideColumn">
      <div class="w-full md:w-[294px] md:flex-shrink-0  md:basis-[294px] ">
        <div
          class="mx-auto flex w-full flex-col gap-[16px] sm2:w-[840px] md:w-full  "
        >
          <div class="flex justify-between ">
            <h1 class="text-[32px] text-base-content">Projects</h1>
            <label
              for="add-project"
              class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
            >
              <i-feather class="text-base-content/70" name="plus" />

              Add
            </label>
          </div>

          <div class="h-[2px] w-full bg-base-content/10"></div>

          <div
            class="grid grid-flow-row grid-cols-1 items-center justify-items-center gap-[24px]  py-[1rem] sm1:grid-cols-2 sm1:justify-start sm2:grid-cols-3 md:justify-center"
          >
            <StudentProjectCard
              *ngFor="let project of projects"
              [navigateTo]="navigateToProject(project.uid)"
            />
          </div>
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="sideColumn">
      <div class="w-full md:w-[294px] md:flex-shrink-0  md:basis-[294px] ">
        <div
          class="mx-auto flex w-full flex-col gap-[16px] sm2:w-[840px] md:w-full  "
        >
          <div class="flex justify-between ">
            <h1 class="text-[32px] text-base-content">Projects</h1>
            <label
              for="add-project"
              class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
            >
              <i-feather class="text-base-content/70" name="plus"></i-feather>

              Add
            </label>
          </div>

          <div class="h-[2px] w-full bg-base-content/10"></div>

          <div
            class="grid grid-cols-1  justify-items-center gap-[24px] py-[1rem] "
          >
            <StudentProjectCard
              *ngFor="let project of projects"
              [navigateTo]="navigateToProject(project.uid)"
            />
          </div>
        </div>
      </div>
    </ng-container>

    <Modal inputId="add-project">
      <div
        class="flex w-[712px] flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between">
            <input
              type="text"
              placeholder="Capstone Project Title"
              class="input w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 bg-primary px-3 py-2 text-[20px] text-primary-content placeholder:text-[20px] placeholder:text-primary-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0 "
            />
          </div>
          <label
            for="add-project"
            class="btn-ghost btn-sm btn-circle btn text-primary-content/60"
            ><i-feather class="text-base-content/70" name="x"
          /></label>
        </div>
        <div class="flex bg-base-100">
          <div class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4">
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Description</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <textarea
              class="textarea h-[117px] w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 leading-normal placeholder:text-base-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0"
              placeholder="Description"
            ></textarea>
          </div>
          <ul class=" flex w-[223px]  flex-col bg-neutral/20 p-0 ">
            <li class="btn-ghost btn flex justify-end gap-2 rounded-[3px]">
              done
              <i-feather class="text-base-content/70" name="check-square" />
            </li>

            <div class="h-full"></div>

            <li class="btn-ghost btn flex justify-end gap-2 rounded-[3px]">
              close
              <i-feather class="text-base-content/70" name="x-circle" />
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  `,
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  tabs: Tab[] = [
    {
      name: 'Title Analyzer',
      id: 'title-analyzer',
      handler: () => {
        this.router.navigate(['s', 'home', 'title-analyzer']);

        this.tabs = this.tabs.map((tab) =>
          tab.id === 'title-analyzer'
            ? { ...tab, active: true }
            : { ...tab, active: false }
        );
      },
    },
    {
      name: 'Projects',
      id: 'projects',
      handler: () => {
        this.router.navigate(['s', 'home', 'projects']);

        this.tabs = this.tabs.map((tab) =>
          tab.id === 'projects'
            ? { ...tab, active: true }
            : { ...tab, active: false }
        );
      },
    },
  ];
  @Input() sideColumn? = false;

  constructor(private router: Router, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projects = this.projectService.getProjects();
  }

  navigateToProject(uid: number) {
    return () => {
      this.router.navigate(['s', 'project', uid]);
      this.projectService.activeProjectIdSignal.set(uid);
    };
  }
}
