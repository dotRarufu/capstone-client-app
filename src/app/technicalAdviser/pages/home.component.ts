import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Tab } from 'src/app/models/tab';
import { Project } from 'src/app/models/project';

@Component({
  template: `
    <div class="flex flex-col gap-[1rem]">
      <div>
        <TopAppBar />
        <Tabs [tabs]="tabs" />
      </div>

      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
      >
        <!-- mobile -->
        <div class="w-full sm2:flex sm2:justify-center md:hidden">
          <router-outlet />
        </div>

        <!-- desktop -->
        <div class="hidden w-full gap-[1rem]  md:flex lg:flex lg:w-[1040px] ">
          <div class="w-full">
            <TechnicalAdviserProjects [sideColumn]="true" />
          </div>

          <div class=" w-[357px] shrink-0  basis-[357px]">
            <Dashboard [sideColumn]="true" />
          </div>
        </div>
      </div>
    </div>
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
  projects: Project[] = [];

  constructor(private router: Router, private projectService: ProjectService) {}

  ngOnInit() {
    this.projects = this.projectService.getProjects();
  }

  handlerFactory(path: string) {
    return () => {
      this.router.navigate(['t', 'home', path]);

      this.tabs = this.tabs.map((tab) =>
        tab.id === path ? { ...tab, active: true } : { ...tab, active: false }
      );
    };
  }
}

// todo: improve
// class="{{
//   active === 'dashboard'
//     ? 'outline-primary/50 outline outline-offset-8 outline-2 rounded-[3px]'
//     : ''
// }}"
