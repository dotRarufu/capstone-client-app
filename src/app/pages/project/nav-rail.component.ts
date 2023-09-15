import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { getRolePath } from 'src/app/utils/getRolePath';
import { FeatherIconsModule } from '../../components/icons/feather-icons.module';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { isNotNull } from 'src/app/utils/isNotNull';

@Component({
  selector: 'navigation-rail',
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
            <i-feather name="share-2" />
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
          (click)="toggleDrawer.emit()"
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
export class NavigationRailComponent {
  @Output() toggleDrawer = new EventEmitter();
  @Input() isFab = false;

  router = inject(Router);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);

  search: string = '';
  projectId = toSignal(
    this.route.url.pipe(map((path) => Number(path[0].path))),
    { initialValue: null }
  );
  user$ = this.authService.getAuthenticatedUser();

  navigateTo(path: string) {
    this.user$
      .pipe(
        filter(isNotNull),
        map((user) => {
          if (user.role_id === null) throw new Error('user has no role id');

          return user;
        }),
        map((user) => getRolePath(user.role_id))
      )
      .subscribe({
        next: (rolePath) => {
          console.log('navigates:', rolePath, path);
          if (rolePath === 's') {
            this.router.navigate([rolePath, 'p', this.projectId(), path]);
            return;
          }

          this.router.navigate([rolePath, 'p', this.projectId(), path]);
        },
      });
  }

  navigateToHome() {
    this.user$
      .pipe(
        filter(isNotNull),
        map((user) => {
          if (user.role_id === null) throw new Error('user has no role id');

          return user;
        }),
        map((user) => getRolePath(user.role_id))
      )
      .subscribe({
        next: (rolePath) => {
          if (rolePath === 's') {
            this.router.navigate([rolePath, 'home']);
            return;
          }

          this.router.navigate([rolePath, 'home']);
        },
      });
  }
}
