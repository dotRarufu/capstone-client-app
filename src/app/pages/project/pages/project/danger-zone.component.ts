import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter, from, map, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { getRolePath } from 'src/app/utils/getRolePath';
import { isNotNull } from 'src/app/utils/isNotNull';

@Component({
  selector: 'danger-zone',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-[16px]">
      <div
        *ngIf="isCapstoneAdviser()"
        class="flex items-center justify-between"
      >
        <div class="flex flex-col gap-[4px]">
          <div class="text-base font-semibold">Delete this project</div>
          <div>
            Once you delete a project, there is no going back. Please be
            certain.
          </div>
        </div>
        <button
          (click)="handleDeleteProject()"
          class="btn-sm btn gap-2 rounded-[3px] text-error hover:btn-error"
        >
          Delete
        </button>
      </div>
      <div class="flex items-center justify-between ">
        <div class="flex flex-col gap-[4px]">
          <div class="text-base font-semibold">Leave project</div>
          <div>
            Once you leave, You can only join back when invited by the project
            members.
          </div>
        </div>
        <button
          (click)="handleLeaveProject()"
          class="btn-sm btn gap-2 rounded-[3px] text-error hover:btn-error"
        >
          Leave
        </button>
      </div>
    </div>
  `,
})
export class DangerZoneComponent {
  projectService = inject(ProjectService);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);
  authService = inject(AuthService);
  router = inject(Router);

  projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);
  user$ = this.authService.getAuthenticatedUser().pipe(
    map((user) => {
      if (user === null) throw new Error('no authenticated user');

      return user;
    })
  );
  isCapstoneAdviser = toSignal(
    this.user$.pipe(
      switchMap((u) =>
        this.projectService.getAdviserProjectRole(this.projectId, u.uid)
      ),
      map((role) => ['c', 'ct'].includes(role))
    )
  );

  navigateToHome() {
    this.user$
      .pipe(
        filter(isNotNull),
        map((user) => {
          if (user.role_id === null) throw new Error('user has no role id');

          const rolePath = getRolePath(user.role_id);

          return rolePath;
        })
      )
      .subscribe({
        next: (rolePath) => {
          if (rolePath === 's') {
            this.router.navigate([rolePath, 'home']);
            return;
          }

          // todo: maybe create a router service, for dealing with these logics
          this.router.navigate([rolePath, 'home']);
        },
        error: (err) => this.toastr.error(err),
      });
  }

  handleDeleteProject() {
    this.projectService.deleteProject(this.projectId).subscribe({
      next: () => {
        this.toastr.success('Project successfully deleted');

        this.navigateToHome();
      },
      error: (err) => {
        console.log('Failed to delete project:', err);
        this.toastr.error('Failed to delete project');
      },
    });
  }

  handleLeaveProject() {
    this.user$
      .pipe(
        filter(isNotNull),
        switchMap((user) =>
          this.projectService.removeProjectParticipant(
            user.uid,
            this.projectId,
            true
          )
        )
      )
      .subscribe({
        next: () => {
          this.toastr.success('successfully left the project');
          this.navigateToHome();
        },
        error: () => {
          this.toastr.error('failed to leave the project');
        },
      });
  }
}
