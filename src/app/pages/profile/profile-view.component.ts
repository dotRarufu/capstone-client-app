import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from 'src/app/models/project';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/types/collection';
import { from, map } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { MilestonesComponent } from 'src/app/components/milestones.component';
import { MilestonesTemplateComponent } from 'src/app/adviser/components/capstone-adviser/milestones-template.component';
import { AddMilestoneModalComponent } from 'src/app/components/modal/add-milestone.component';

@Component({
  selector: 'ProfileView',
  standalone: true,
  imports: [
    CommonModule,
    MilestonesTemplateComponent,
    AddMilestoneModalComponent,
  ],
  template: `
    <ng-container *ngIf="!sideColumn">
      <div
        class="flex w-full flex-col gap-[1rem] sm2:w-[840px] md:w-full lg:w-full "
      >
        <div
          class="hidden flex-col gap-2 sm1:flex-row sm1:items-center sm1:justify-between md:flex"
        >
          <h2 class="text-[24px] text-base-content sm1:text-[32px]">Profile</h2>
        </div>
        <div class="hidden h-[2px] w-full bg-base-content/10 md:block"></div>

        <div class="flex w-full flex-col gap-4">
          <div class="flex gap-4">
            <div class="avatar">
              <div class="w-24 rounded-xl">
                <img src="https://api.multiavatar.com/test.png" />
              </div>
            </div>
            <div class="flex flex-col justify-center gap-1">
              <h1 class="text-[24px]">{{ user.name }}</h1>
              <p class="text-base text-base-content/70">ID: {{ user.uid }}</p>
            </div>
          </div>

          <ul>
            <li class="form-control w-full">
              <label class="label flex cursor-pointer items-center">
                <span class="label-text text-[18px] sm2:text-[20px]">Notifications</span>
                <input type="checkbox" class="toggle-primary toggle" checked />
              </label>
            </li>
            <li class="form-control w-full">
              <label class="label flex cursor-pointer items-center">
                <span class="label-text text-[18px] sm2:text-[20px]">Dark Mode</span>
                <input
                  (change)="changeTheme()"
                  type="checkbox"
                  class="toggle-primary toggle"
                  checked
                />
              </label>
            </li>
            <li class="flex w-full items-center justify-between px-1 py-2">
              <span class="label-text text-[18px] sm2:text-[20px]">Add to Home Screen</span>
              <button (click)="installPwa()" class="btn-primary btn-sm btn">
                Install
              </button>
            </li>
          </ul>

          <milestones-template *ngIf="user.role_id === 1" />
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="sideColumn">
      <div
        class="hidden w-full flex-col gap-[1rem] sm2:w-[840px] md:flex md:w-full lg:w-full"
      >
        <div
          class="flex flex-col gap-2 sm1:flex-row sm1:items-center sm1:justify-between"
        >
          <h2 class="text-[24px] text-base-content">Profile</h2>
        </div>
        <div class="hidden h-[2px] w-full bg-base-content/20 md:block"></div>

        <div class="flex w-full flex-col gap-4">
          <div class="flex gap-4">
            <div class="avatar">
              <div class="w-24 rounded-xl">
                <img src="https://api.multiavatar.com/test.png" />
              </div>
            </div>
            <div class="flex flex-col justify-center gap-1">
              <h1 class="text-[24px]">{{ user.name }}</h1>
              <p class="text-base text-base-content/70">ID: {{ user.uid }}</p>
            </div>
          </div>

          <ul>
            <li class="form-control w-full">
              <label class="label flex cursor-pointer items-center">
                <span class="label-text text-[18px] sm2:text-[20px]">Notifications</span>
                <input type="checkbox" class="toggle-primary toggle" checked />
              </label>
            </li>
            <li class="form-control w-full">
              <label class="label flex cursor-pointer items-center">
                <span class="label-text text-[18px] sm2:text-[20px]">Dark Mode</span>
                <input
                  (change)="changeTheme()"
                  type="checkbox"
                  class="toggle-primary toggle"
                  checked
                />
              </label>
            </li>
            <li class="flex w-full items-center justify-between px-1 py-2">
              <span class="label-text text-[18px] sm2:text-[20px]">Add to Home Screen</span>
              <button (click)="installPwa()" class="btn-primary btn-sm btn">
                Install
              </button>
            </li>
          </ul>

          <milestones-template *ngIf="user.role_id === 1" [sideColumn]="true" />
        </div>
      </div>
    </ng-container>
  `,
})
export class ProfileViewComponent implements OnInit {
  search: string = '';
  deferredPrompt: any;
  projects: Project[] = [];
  theme: string = 'original';
  @Input() sideColumn? = false;
  user: User = { name: 'Unloggedin User', role_id: -1, uid: '1231-232as-ddaf' };

  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    // use loading while getCurrentUser is not loaded
    this.spinner.show();

    const user$ = from(this.authService.getAuthenticatedUser());

    user$
      .pipe(
        map((user) => {
          if (user === null) throw new Error('user cant be null');

          return user;
        })
      )
      .subscribe({
        next: (user) => {
          this.user = user;
          this.spinner.hide();
        },
      });

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault(); // Prevent the default behavior
      this.deferredPrompt = event;
    });
  }

  changeTheme() {
    this.theme = this.theme === 'dark' ? 'original' : 'dark';
    document.querySelector('html')?.setAttribute('data-theme', this.theme);
  }

  installPwa() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt(); // Prompt the user to install the PWA
      this.deferredPrompt = null; // Reset the deferredPrompt
    }
  }
}
