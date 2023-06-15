import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { getRolePath } from 'src/app/utils/getRolePath';

@Component({
  selector: 'NavigationRail',
  template: `
    <ng-container *ngIf="!isFab">
      <div
        class="flex h-full w-fit flex-col items-center justify-between gap-[12px] bg-primary px-[4px] py-[24px] text-primary-content"
      >
        <div class="hidden h-[48px] lg:block"></div>
        <button
          (click)="handleMenuClick()"
          class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px] lg:hidden"
        >
          <i-feather name="sidebar" />
        </button>

        <div class="flex h-fit  flex-col items-center gap-[12px]">
          <button
            (click)="navigateTo('tasks')"
            class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px] "
          >
            <i-feather name="trello" />
            Tasks
          </button>
          <button
            (click)="navigateTo('dashboard')"
            class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
          >
            <i-feather name="monitor" />
            Dashboard
          </button>
          <button
            (click)="navigateTo('consultations')"
            class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
          >
            <i-feather name="clipboard" />
            Consult
          </button>
          <button
            (click)="navigateTo('participants')"
            class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
          >
            <i-feather name="users" />
            Participants
          </button>
          <button
            (click)="navigateTo('forms')"
            class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
          >
            <i-feather name="file-text" />
            Forms
          </button>
        </div>

        <button
          (click)="navigateToHome()"
          class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
        >
          <i-feather name="arrow-left" />
        </button>
      </div>
    </ng-container>

    <ng-container *ngIf="isFab">
      <div
        class="text-primary- flex h-full w-fit flex-col items-center justify-between gap-[12px] bg-transparent px-[4px] py-[24px]"
      >
        <div class="hidden h-[48px] lg:block"></div>
        <button
          (click)="handleMenuClick()"
          class="btn-ghost bg-base-100/70 text-base-content border-0 rounded-[3px] btn flex h-fit w-full flex-col items-center gap-[4px] px-[4px] py-[8px] text-[10px] lg:hidden"
        >
          <i-feather name="sidebar" />
        </button>

        <div class="flex h-fit  flex-col items-center gap-[12px]">
          <button
            (click)="navigateTo('tasks')"
            class="btn-ghost bg-base-100/70 text-base-content border-0  btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px] "
          >
            <i-feather name="trello" />
            Tasks
          </button>
          <button
            (click)="navigateTo('dashboard')"
            class="btn-ghost border-0 bg-base-100/70 text-base-content btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
          >
            <i-feather name="monitor" />
            Dashboard
          </button>
          <button
            (click)="navigateTo('consultations')"
            class="btn-ghost border-0 bg-base-100/70 text-base-content btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
          >
            <i-feather name="clipboard" />
            Consult
          </button>
          <button
            (click)="navigateTo('participants')"
            class="btn-ghost border-0 bg-base-100/70 text-base-content btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
          >
            <i-feather name="users" />
            Participants
          </button>
          <button
            (click)="navigateTo('forms')"
            class="btn-ghost border-0 bg-base-100/70 text-base-content btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
          >
            <i-feather name="file-text" />
            Forms
          </button>
        </div>

        <button
          (click)="navigateToHome()"
          class="btn-ghost border-0 bg-base-100/70 text-base-content btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
        >
          <i-feather name="arrow-left" />
        </button>
      </div>
    </ng-container>
  `,
})
export class NavigationRailComponent implements OnInit {
  search: string = '';
  projectId = -1;
  @Output() toggleDrawer: EventEmitter<string> = new EventEmitter();
  @Input() isFab = false;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.projectId = this.projectService.activeProjectIdSignal();
  }

  navigateTo(path: string) {
    const user = this.authService.getCurrentUser();
    if (user != null) {
      // move this inside a pipe
      if (user.role_id === null) throw new Error('user has no role id');

      const rolePath = getRolePath(user.role_id);

      // console.log('path:', path);
      // todo: make the "c" dynamic
      // console.log('navigate with:', this.projectId);
      this.router.navigate([rolePath, 'project', this.projectId, path]);
    }


  }

  navigateToHome() {
    const user = this.authService.getCurrentUser();
    if (user != null) {
      // move this inside a pipe
      if (user.role_id === null) throw new Error('user has no role id');

      const rolePath = getRolePath(user.role_id);
      this.router.navigate([rolePath, 'home']);
    }

  }

  handleMenuClick() {
    this.toggleDrawer.emit();
  }
}
