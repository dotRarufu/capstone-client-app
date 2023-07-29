import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { AuthService } from '../services/auth.service';
import { getRolePath } from '../utils/getRolePath';

@Component({
  selector: 'mobile-header',
  standalone: true,
  imports: [FeatherIconsModule, BreadcrumbModule],
  template: `
    <div
      class="navbar fixed left-0 top-0 z-[1] bg-base-100 px-[32px] shadow min-[998px]:hidden"
    >
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
        <button (click)="navigateTo('project')" class="btn-ghost btn-square btn">
          <i-feather name="list" />
        </button>
      </div>
    </div>
  `,
})
export class MobileHeaderComponent {
  projectId: number | null = null;

  constructor(
    private router: Router,
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
}
