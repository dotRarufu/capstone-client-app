import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TabsComponent } from 'src/app/components/tabs.component';
import { TopAppBarComponent } from 'src/app/components/top-app-bar.component';
import { Project } from 'src/app/models/project';
import { Tab } from 'src/app/models/tab';
import { ProfileViewComponent } from './profile-view.component';
import { ReportsComponent } from 'src/app/components/reports.component';
import { TabsService } from 'src/app/services/tabs.service';
import { AdviserProfileReportsComponent } from 'src/app/adviser/components/profile-reports.component';
import { AddMilestoneTemplateModalComponent } from '../../adviser/components/capstone-adviser/add-milestone-template.component';

@Component({
  standalone: true,
  imports: [
    TopAppBarComponent,
    TabsComponent,
    RouterModule,
    ReportsComponent,
    ProfileViewComponent,
    AdviserProfileReportsComponent,
    AddMilestoneTemplateModalComponent,
  ],
  template: `
    <add-milestone-template-modal />
    <div class="flex flex-col gap-[1rem]">
      <div>
        <TopAppBar activePath="Profile" />
        <Tabs />
      </div>

      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
      >
        <div class="w-full sm2:flex sm2:justify-center md:hidden">
          <router-outlet />
        </div>

        <!-- desktop -->
        <div class="hidden w-full gap-[1rem]  md:flex lg:flex lg:w-[1040px] ">
          <div class="w-full  ">
            <ProfileView [sideColumn]="true" />
          </div>

          <div class=" w-[357px] shrink-0  basis-[357px] ">
            <adviser-profile-reports [sideColumn]="true" />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  tabs: Tab[] = [
    {
      name: 'Profile',
      active: true,
      id: 'view',
      handler: this.handlerFactory('view'),
    },
    {
      name: 'reports',
      id: 'reports',
      handler: this.handlerFactory('reports'),
    },
  ];
  projects: Project[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tabsService: TabsService
  ) {}

  handlerFactory(path: string) {
    return () => {
      this.router.navigate(['profile', path]);

      this.tabs = this.tabs.map((tab) =>
        tab.id === path ? { ...tab, active: true } : { ...tab, active: false }
      );
    };
  }

  ngOnInit() {
    const child1 = this.route.snapshot.firstChild;

    if (child1 === null) throw new Error('impossible');

    const active = child1.url[0].path;
    const route = ['profile'];

    this.tabsService.setTabs(this.tabs, route, active);
  }
}
