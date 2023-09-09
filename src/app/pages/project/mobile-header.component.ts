import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { AuthService } from '../../services/auth.service';
import { getRolePath } from '../../utils/getRolePath';
import { filter, map, tap } from 'rxjs';
import { isNotNull } from 'src/app/utils/isNotNull';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'mobile-header',
  standalone: true,
  imports: [FeatherIconsModule, BreadcrumbModule],
  template: `
    <div
      class="navbar relative bg-base-100 px-[16px] shadow sm1:px-[32px] sm2:px-0"
    >
      <div class="w-full sm2:mx-auto sm2:w-[840px]">
        <div class="flex-1">
          <xng-breadcrumb
            [separator]="iconTemplate"
            class="text-base font-semibold"
          ></xng-breadcrumb>
          <ng-template #iconTemplate>
            <i-feather class="text-base-content/50" name="chevron-right" />
          </ng-template>
        </div>
        <div class="flex-none">
          <button
            (click)="navigateTo('project')"
            class="btn-ghost btn-square btn"
          >
            <i-feather name="list" />
          </button>
        </div>
      </div>
    </div>
  `,
})
export class MobileHeaderComponent {
  router = inject(Router);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);

  projectId = toSignal(
    this.route.url.pipe(map((path) => Number(path[0].path))), {initialValue: null}
  );

  navigateTo(path: string) {
    const user$ = this.authService.getAuthenticatedUser();
    user$
      .pipe(
        filter(isNotNull),
        map((user) => {
          if (user.role_id === null) throw new Error('user has no role id');

          return user;
        }),
        map((user) => getRolePath(user.role_id)),
        tap((rolePath) => {
          if (rolePath === 's') {
            this.router.navigate([rolePath, 'p', this.projectId(), path]);
            return;
          }

          this.router.navigate([rolePath, 'p', this.projectId(), path]);
        })
      )
      .subscribe({
        next: () => {},
      });
  }
}
