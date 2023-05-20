import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tab } from 'src/app/models/tab';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-student-title-analyzer',
  template: `
    <div class="w-full sm2:flex sm2:justify-center">
      <div class="flex w-full flex-col gap-[16px]  sm2:w-[840px] md:w-full ">
        <div class="flex justify-between ">
          <h1 class="text-[32px] text-base-content">Title Analysis</h1>
          <button
            (click)="analyzeTitle()"
            class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
          >
            <i-feather name="zap"></i-feather>

            Analyze
          </button>
        </div>

        <div class="h-[2px] w-full bg-base-content/10"></div>

        <app-student-accordion
          *ngFor="let content of contents"
          [heading]="content.heading"
        >
          <div class="pt-[16px] px-[16px] text-base-content">
            {{ content.content }}
          </div>
        </app-student-accordion>
      </div>
    </div>
  `,
})
export class TitleAnalyzerComponent implements OnInit {
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
  contents: { heading: string; content: string }[] = [
    {
      heading: 'Substantive Word Count',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.',
    },
    {
      heading: 'Title Uniqueness',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.',
    },
    {
      heading: 'Readability',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.',
    },
  ];

  //   todo: create a constant file, or fetch data from database. Maybe we can create an interface to edit the constants
  // does ng module accept script files, and not only modules, services etc..?
  // todo: add loader
  // todo: add ability to change renderer in docx viewer (form generator)

  constructor(private router: Router, private projectService: ProjectService) {}

  navigateToProject(uid: string) {
    return () => {
      this.router.navigate(['s', 'project', uid]);
      this.projectService.activeProjectId = uid;
    };
  }

  analyzeTitle() {
    // todo: wip
    this.router.navigate(['s', 'home', 'title-analyzer', 'result']);
  }

  ngOnInit(): void {
    this.projects = this.projectService.getProjects();
  }
}
