import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Project } from 'src/app/models/project';
import { Tab } from 'src/app/models/tab';
import { ProfileViewComponent } from './profile-view.component';
import { TabsService } from 'src/app/services/tabs.service';
import { AdviserProfileReportsComponent } from 'src/app/pages/profile/profile-reports.component';
import { AddMilestoneTemplateModalComponent } from './add-milestone-template.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TabsComponent } from 'src/app/components/ui/tabs.component';
import { TopAppBarComponent } from 'src/app/components/ui/top-app-bar.component';

@Component({
  standalone: true,
  imports: [
    TopAppBarComponent,
    TabsComponent,
    RouterModule,
    ProfileViewComponent,
    AdviserProfileReportsComponent,
    AddMilestoneTemplateModalComponent,
    NgxSpinnerModule,
  ],
  template: `
    <add-milestone-template-modal />
    <div class="flex flex-col gap-[1rem]">
      <div>
        <top-app-bar activePath="Profile" />
        <tabs />
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
            <profile-view [sideColumn]="true" />
          </div>

          <div class=" w-[357px] shrink-0  basis-[357px] ">
            <adviser-profile-reports [sideColumn]="true" />
          </div>
        </div>
      </div>
    </div>

    <ngx-spinner
      bdColor="rgba(0, 0, 0, 0.8)"
      size="default"
      color="#fff"
      type="square-loader"
      [fullScreen]="true"
      ><p style="color: white">Loading...</p></ngx-spinner
    >
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
