import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { getRolePath } from 'src/app/utils/getRolePath';
import { filter, map, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { isNotNull } from 'src/app/utils/isNotNull';
import { ImgFallbackModule } from 'ngx-img-fallback';

@Component({
  selector: 'top-app-bar',
  standalone: true,
  imports: [FeatherIconsModule, NgxSpinnerModule, CommonModule, ImgFallbackModule],
  template: `
    <div
      class=" w-full bg-primary  px-[1rem]  py-[1rem]  sm1:px-[32px] sm2:px-0 md:px-[200px]"
      *ngIf="{ notifications: notifications$ | async } as observables"
    >
      <div
        class=" flex  w-full flex-row  items-center justify-between text-primary-content   sm2:mx-auto sm2:w-[840px] md:w-full lg:w-[1040px]"
      >
        <h1 class="text-xl ">{{ activePath }}</h1>

        <div class="dropdown-end dropdown ">
          <label tabindex="0"
            ><div
              class="btn-ghost btn flex flex-row items-center gap-2 text-base"
            >
              {{ name | async }}
              <div class="avatar">
                <div class="w-[40px] rounded-full">
                  <img
                    [src]="userAvatarUrl$ | async"
                    src-fallback="{{ fallbackAvatar$ | async }}"
                  />
                </div>
              </div></div
          ></label>
          <ul
            tabindex="0"
            class="dropdown-content menu z-[999] w-52 rounded-[3px] bg-base-100 p-2 shadow"
          >
            <a
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
              (click)="navigateHome()"
              ><i-feather class="text-base-content/70" name="home" />home
            </a>
            <a
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px]
              text-base-content"
              (click)="this.router.navigate(['profile', 'view'])"
            >
              <i-feather class="text-base-content/70 " name="user" />

              <div
                *ngIf="observables.notifications; else empty"
                class="indicator flex-1 "
              >
                <span
                  class="indicator-end indicator-middle indicator-item aspect-square w-[8px] rounded-full bg-primary"
                ></span>
                <div class="text-left">profile</div>
              </div>
              <ng-template #empty>profile</ng-template>
            </a>
            <a
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px]
              text-base-content"
              (click)="signOut()"
              ><i-feather class="text-base-content/70" name="log-out" />sign out
            </a>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class TopAppBarComponent {
  @Input() activePath? = 'Home';

  authService = inject(AuthService);
  spinner = inject(NgxSpinnerService);
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
  name = this.user$.pipe(map((user) => user?.name || 'unnamed'));

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
