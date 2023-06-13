import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Tab } from 'src/app/models/tab';

@Component({
  selector: 'app-student-title-analyzer-result',
  template: `
      <div class="flex flex-col gap-[1rem]">
      <div>
        <app-top-app-bar activePath="Profile"></app-top-app-bar>
        <app-tabs [tabs]="tabs"></app-tabs>
      </div>

      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
      >
        <div class="w-full sm2:flex sm2:justify-center md:hidden">
          <router-outlet></router-outlet>
        </div>

        <!-- desktop -->
        <div class="hidden w-full gap-[1rem]  md:flex lg:w-[1040px] lg:flex ">
          <!-- projects -->
            <div class="w-full">
          
              <app-profile-view></app-profile-view>
            </div>
          
        

          <div class=" w-[357px] shrink-0  basis-[357px]">
            <!-- todo: do this in other comps, to reduce repetition of tags -->
            <app-dashboard [sideColumn]="true"></app-dashboard>
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
      id: 'view',
      handler: () => {
        this.router.navigate(['profile', 'view']);

        this.tabs = this.tabs.map((tab) =>
          tab.id === 'view' ? { ...tab, active: true } : {...tab, active: false}
        );
      },
    },
    {
      name: 'dashboard',
      id: 'dashboard',
      handler: () => {
        this.router.navigate(['profile', 'dashboard']);

        this.tabs = this.tabs.map((tab) =>
          tab.id === 'dashboard' ? { ...tab, active: true } : {...tab, active: false}
        );
      },
    },
  ];
  projects: {
    name: string;
    uid: number;
    description: string;
    members: string[];
  }[] = [];

  constructor(
    private router: Router,
  ) {}

  test() {
    console.log('test');
  }
}