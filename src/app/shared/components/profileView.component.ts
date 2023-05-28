import { Component, Input } from '@angular/core';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-profile-view',
  template: `
    <ng-container *ngIf="!sideColumn">
      <div
        class="flex w-full flex-col gap-[1rem] sm2:w-[840px] md:w-full lg:w-full "
      >
        <div
          class="flex flex-col gap-2 sm1:flex-row sm1:items-center sm1:justify-between"
        >
          <h2 class="text-[24px] sm1:text-[32px]">Profile</h2>
        </div>
        <div class="h-[2px] w-full bg-base-content/10"></div>

        <div class="w-full flex flex-col gap-4">
          <div class="flex gap-4">
            <div class="avatar">
              <div class="w-24 rounded-xl">
                <img src="https://api.multiavatar.com/test.png" />
              </div>
            </div>
            <div class="flex flex-col gap-1 justify-center">
              <h1 class="text-[24px]">Roadie Fernandez</h1>
              <p class="text-base text-base-content/70">Created at 1/2/34</p>
            </div>
          </div>

          <ul>
           
            <li class="form-control w-full">
              <label class="label cursor-pointer flex items-center">
                <span class="label-text text-[20px]">Notifications</span>
                <input type="checkbox" class="toggle-primary toggle" checked />
              </label>
            </li>
            <li class="form-control w-full">
              <label class="label cursor-pointer flex items-center">
                <span class="label-text text-[20px]">Dark Mode</span>
                <input (change)="changeTheme()" type="checkbox" class="toggle-primary toggle" checked />
              </label>
            </li>
            <li class="form-control w-full">
              <label class="label cursor-pointer flex items-center">
                <span class="label-text text-[20px]">Notifications</span>
                <input type="checkbox" class="toggle-primary toggle" checked />
              </label>
            </li>
          </ul>
        </div>
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
          ></div>
        </div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <div
          class="flex w-full flex-col justify-items-center gap-[24px] py-[1rem]"
        >
          test
        </div>
      </div>
    </ng-container>
  `,
})
export class ProfileViewComponent {
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
    this.projects = this.projectService.getProjects();
  }

  theme: string = 'original';

  changeTheme() {
    console.log('runs')
    this.theme = this.theme === 'dark' ? 'original' : 'dark';
    
    document.querySelector('html')?.setAttribute('data-theme', this.theme);
  }
}
