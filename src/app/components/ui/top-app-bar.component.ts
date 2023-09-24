import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { getRolePath } from 'src/app/utils/getRolePath';
import { filter, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { isNotNull } from 'src/app/utils/isNotNull';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'top-app-bar',
  standalone: true,
  imports: [
    FeatherIconsModule,
    NgxSpinnerModule,
    CommonModule,
    ImgFallbackModule,
  ],
  template: `
    <div
      class=" w-full bg-primary  px-[1rem]  py-[1rem]  sm1:px-[32px] sm2:px-0 md:px-[200px]"
      *ngIf="{
        notifications: notifications$ | async,
        schedules: schedules$ | async,
        user: user$ | async,
        forcedSchedules: forcedSchedules$ | async
      } as observables"
      [class.bg-[#463dbc]]="observables.user?.role_id === 5"
    >
      <div
        class=" flex  w-full flex-row  items-center justify-between text-primary-content   sm2:mx-auto sm2:w-[840px] md:w-full lg:w-[1040px]"
      >
        <div
          (click)="navigateHome()"
          class="btn-ghost btn flex items-center gap-2 p-1"
        >
          <img
            class="aspect-square w-[40px] rounded-[5px] bg-secondary p-1"
            src="assets/capstone.ico"
            alt=""
          />
          <h1 class="text-lg normal-case text-primary-content">Capstone</h1>
        </div>

        <div class="flex gap-2">
          <a
            class="btn-ghost btn hidden justify-start  gap-2 rounded-[5px] text-primary-content sm1:flex"
            (click)="navigateHome()"
            >home
          </a>
          <a
            class="btn-ghost btn hidden justify-start gap-4 rounded-[5px] text-primary-content
              sm1:flex"
            (click)="this.router.navigate(['profile', 'view'])"
          >
            <div
              *ngIf="
                observables.notifications ||
                  observables.schedules ||
                  observables.forcedSchedules;
                else empty
              "
              class="indicator flex-1 "
            >
              <span
                class="indicator-item aspect-square w-[10px] rounded-full bg-secondary"
              >
                <span
                  class="absolute left-[-1px]  top-[-1px] inline-flex h-[120%] w-[120%] animate-ping rounded-full bg-secondary opacity-75"
                ></span>
              </span>
              <div class="text-left">profile</div>
            </div>
            <ng-template #empty>profile</ng-template>
          </a>

          <div class="dropdown-end dropdown ">
            <label tabindex="0"
              ><div
                class="btn-ghost btn flex flex-row items-center gap-2 text-base"
              >
                <!-- <span class="hidden sm1:block">{{ name | async }}</span> -->
                <div class="avatar hidden sm1:block">
                  <div class="w-[40px] rounded-full">
                    <img
                      [src]="userAvatarUrl$ | async"
                      src-fallback="{{ fallbackAvatar$ | async }}"
                    />
                  </div>
                </div>
                <i-feather
                  name="list"
                  class="text-primary-content/70 sm1:absolute sm1:opacity-0"
                />
              </div>
            </label>
            <ul
              tabindex="0"
              class="dropdown-content menu z-[999] w-52 rounded-[3px] bg-base-100 p-2 shadow"
            >
              <div class="flex flex-col gap-4 p-2 pb-2">
                <div class="flex items-center gap-2">
                  <div class="avatar">
                    <div class="w-[40px] rounded-full">
                      <img
                        [src]="userAvatarUrl$ | async"
                        src-fallback="{{ fallbackAvatar$ | async }}"
                      />
                    </div>
                  </div>
                  <span class="text-md font-bold uppercase text-base-content">
                    {{ name | async }}
                  </span>
                </div>
                <div class="h-[2px] w-full bg-base-content/10"></div>
              </div>
              <a
                class="btn-ghost btn flex justify-start gap-4 rounded-[3px] text-base-content sm1:hidden"
                (click)="navigateHome()"
                ><i-feather class="text-base-content/70" name="home" />home
              </a>
              <a
                class="btn-ghost btn flex justify-start gap-4 rounded-[3px] text-base-content
              sm1:hidden"
                (click)="this.router.navigate(['profile', 'view'])"
              >
                <i-feather class="text-base-content/70 " name="user" />

                <div
                  *ngIf="
                    observables.notifications ||
                      observables.schedules ||
                      observables.forcedSchedules;
                    else empty
                  "
                  class="indicator flex-1 "
                >
                  <span
                    class="indicator-end indicator-middle indicator-item aspect-square w-[8px] rounded-full bg-primary"
                  >
                    <span
                      class="absolute left-[-1px]  top-[-1px] inline-flex h-[120%] w-[120%] animate-ping rounded-full bg-secondary opacity-75"
                    ></span>
                  </span>
                  <div class="text-left">profile</div>
                </div>
                <ng-template #empty>profile</ng-template>
              </a>
              <a
                class="btn-ghost btn flex justify-start gap-4 rounded-[3px]
              text-base-content"
                (click)="signOut()"
                ><i-feather class="text-base-content/70" name="log-out" />sign
                out
              </a>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TopAppBarComponent {
  @Input() activePath? = 'Home';

  authService = inject(AuthService);
  spinner = inject(NgxSpinnerService);
  projectService = inject(ProjectService);
  router = inject(Router);

  user$ = this.authService.getAuthenticatedUser().pipe(
    filter(isNotNull),
    switchMap((user) => this.authService.getUserProfile(user.uid))
  );
  fallbackAvatar$ = this.user$.pipe(
    map((user) => `https://api.multiavatar.com/${user.name}.png`)
  );
  userAvatarUrl$ = this.user$.pipe(
    map((user) => {
      const { avatar_last_update, avatar } = user;
      const time = avatar_last_update;

      if (time === null) {
        return avatar;
      }
      const base = avatar.slice(0, avatar.indexOf('.png'));
      const newUrl = `${base}-t-${time}.png`;

      return newUrl;
    })
  );
  notifications$ = this.authService
    .getNotifications()
    .pipe(map((n) => n.length > 0));
  schedules$ = this.authService
    .getUnavailableSchedules()
    .pipe(map((n) => n.length > 0));
  name = this.user$.pipe(map((user) => user?.name || 'unnamed'));
  forcedSchedules$ = this.projectService.getProjects().pipe(
    filter(isNotNull),
    switchMap((projects) => {
      if (projects.length === 0) return of([]);

      return forkJoin(
        projects.map(({ id }) => this.projectService.getProjectInfo(id))
      );
    }),
    map((projects) => projects.map((p) => p.technical_adviser_id)),
    map((ids) => ids.filter((id) => id !== null) as string[]),

    switchMap((technicalAdvisers) =>
      this.authService.getForcedSchedules(technicalAdvisers)
    ),
    map((p) => p.length > 0),
    tap((v) => console.log('foredes:', v))
  );

  signOut() {
    this.spinner.show();
    // Todo: test for completion
    this.authService.signOut().subscribe((v) => this.spinner.hide());
  }

  navigateHome() {
    this.user$
      .pipe(
        filter(isNotNull),
        map((user) => {
          const rolePath = getRolePath(user.role_id);
          const route = [rolePath, 'home'];

          // if (rolePath !== 's') {
          //   route.unshift('a');
          // }

          return route;
        }),
        tap((route) => this.router.navigate(route))
      )
      .subscribe({
        next: () => {},
      });
  }
}
