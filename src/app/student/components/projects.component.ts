import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tab } from 'src/app/models/tab';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-student-projects',
  template: `
    <div class="w-full md:w-[294px] md:flex-shrink-0  md:basis-[294px] ">
      <div class="flex w-full flex-col gap-[16px]  sm2:w-[840px] md:w-full ">
        <div class="flex justify-between ">
          <h1 class="text-[32px] text-base-content">Projects</h1>
          <button
            class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
          >
            <i-feather name="plus"></i-feather>

            Add
          </button>
        </div>

        <div class="h-[2px] w-full bg-base-content/10"></div>

        <div
          class="flex flex-wrap justify-center gap-[24px] py-[1rem] sm1:justify-start md:justify-center"
        >
          <app-project-card
            *ngFor="let project of projects"
            [navigateTo]="navigateToProject(project.uid)"
          >
          </app-project-card>
        </div>
      </div>
    </div>
  `,
})
export class ProjectsComponent implements OnInit {
  projects: {
    name: string;
    uid: string;
    description: string;
    members: string[];
  }[] = [];
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

  constructor(private router: Router, private projectService: ProjectService) {}

  navigateToProject(uid: string) {
    return () => {
      this.router.navigate(['s', 'project', uid]);
      this.projectService.activeProjectId = uid;
    };
  }

  ngOnInit(): void {
    this.projects = this.projectService.getProjects();
  }
}
