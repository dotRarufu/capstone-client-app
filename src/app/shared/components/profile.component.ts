import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { Tab } from 'src/app/models/tab';

@Component({
  template: `
    <div class="flex flex-col gap-[1rem]">
      <div>
        <TopAppBar activePath="Profile" />
        <Tabs [tabs]="tabs" />
      </div>

      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
      >
        <div class="w-full sm2:flex sm2:justify-center md:hidden">
          <router-outlet />
        </div>

        <!-- desktop -->
        <div class="hidden w-full gap-[1rem]  md:flex lg:flex lg:w-[1040px] ">
          <div class="w-full">
            <app-profile-view />
          </div>

          <div class=" w-[357px] shrink-0  basis-[357px]">
            <Dashboard [sideColumn]="true" />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent {
  tabs: Tab[] = [
    {
      name: 'Profile',
      active: true,
      id: 'view',
      handler: () => {
        this.router.navigate(['profile', 'view']);

        this.tabs = this.tabs.map((tab) =>
          tab.id === 'view'
            ? { ...tab, active: true }
            : { ...tab, active: false }
        );
      },
    },
    {
      name: 'dashboard',
      id: 'dashboard',
      handler: () => {
        this.router.navigate(['profile', 'dashboard']);

        this.tabs = this.tabs.map((tab) =>
          tab.id === 'dashboard'
            ? { ...tab, active: true }
            : { ...tab, active: false }
        );
      },
    },
  ];
  projects: Project[] = [];

  constructor(private router: Router) {}
}