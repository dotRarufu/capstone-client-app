import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { getRolePath } from 'src/app/utils/getRolePath';
import { FeatherIconsModule } from '../modules/feather-icons.module';

@Component({
  selector: 'NavigationRail',
  standalone: true,
  imports: [CommonModule, FeatherIconsModule],
  template: `
    <ng-container *ngIf="!isFab">
      <div
        class="flex h-full w-fit flex-col items-center justify-between gap-[12px] bg-primary px-[4px] py-[24px] text-primary-content"
      >
        <div class="hidden h-[48px] lg:block"></div>
        <button
        (click)="navigateTo('project')"
          class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px] lg:hidden"
        >
          <i-feather name="list" />
          Project
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
            (click)="navigateTo('consultations')"
            class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
          >
            <i-feather name="clipboard" />
            Consult
          </button>
          <button
            (click)="navigateTo('milestones')"
            class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
          >
            <i-feather name="users" />
            Milestones
          </button>
         
        </div>

        <button
          (click)="navigateToHome()"
          class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
        >
          <i-feather name="arrow-left" />
          Back
        </button>
      </div>
    </ng-container>

    <ng-container *ngIf="isFab">
      <div
        class="flex h-full w-fit flex-col items-center justify-between gap-[12px] bg-transparent px-[4px] py-[24px] text-primary"
      >
        <div class="hidden h-[48px] lg:block"></div>
        <button
          (click)="handleMenuClick()"
          class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] border-0 bg-base-100/70 px-[4px] py-[8px] text-[10px] text-base-content lg:hidden"
        >
          <i-feather name="sidebar" />
        </button>

        <div class="flex h-fit  flex-col items-center gap-[12px]">
          <button
            (click)="navigateTo('tasks')"
            class="btn-ghost btn flex h-fit  w-full flex-col items-center gap-[4px] rounded-[3px] border-0 bg-base-100/70 px-[4px] py-[8px] text-[10px] text-base-content "
          >
            <i-feather name="trello" />
            Tasks
          </button>
          <button
            (click)="navigateTo('reports')"
            class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] border-0 bg-base-100/70 px-[4px] py-[8px] text-[10px] text-base-content"
          >
            <i-feather name="monitor" />
            Reports
          </button>
          <button
            (click)="navigateTo('consultations')"
            class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] border-0 bg-base-100/70 px-[4px] py-[8px] text-[10px] text-base-content"
          >
            <i-feather name="clipboard" />
            Consult
          </button>
          <button
            (click)="navigateTo('participants')"
            class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] border-0 bg-base-100/70 px-[4px] py-[8px] text-[10px] text-base-content"
          >
            <i-feather name="users" />
            Participants
          </button>
          <button
            (click)="navigateTo('forms')"
            class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] border-0 bg-base-100/70 px-[4px] py-[8px] text-[10px] text-base-content"
          >
            <i-feather name="file-text" />
            Forms
          </button>
        </div>

        <button
          (click)="navigateToHome()"
          class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] border-0 bg-base-100/70 px-[4px] py-[8px] text-[10px] text-base-content"
        >
          <i-feather name="arrow-left" />
        </button>
      </div>
    </ng-container>
  `,
})
export class NavigationRailComponent implements OnInit {
  search: string = '';
  projectId: number | null = null;
  @Output() toggleDrawer: EventEmitter<string> = new EventEmitter();
  @Input() isFab = false;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.url.subscribe({
      next: (b) => {
        const projectId = Number(b[0].path);
        this.projectId = projectId;
      },
    });
  }

  async navigateTo(path: string) {
    const user = await this.authService.getAuthenticatedUser();

    if (user != null) {
      // move this inside a pipe
      if (user.role_id === null) throw new Error('user has no role id');

      const rolePath = getRolePath(user.role_id);
      if (rolePath === 's') {
        this.router.navigate([rolePath, 'p', this.projectId, path]);
        return;
      }

      this.router.navigate(['a', rolePath, 'p', this.projectId, path]);
    }
  }

  async navigateToHome() {
    const user = await this.authService.getAuthenticatedUser();

    if (user != null) {
      const rolePath = getRolePath(user.role_id);

      if (rolePath === 's') {
        this.router.navigate([rolePath, 'home']);
        return;
      }

      this.router.navigate(['a', rolePath, 'home']);
    }
  }

  handleMenuClick() {
    this.toggleDrawer.emit();
  }
}
