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
      map((role) => role === 'c')
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

          this.router.navigate(['a', rolePath, 'home']);
        },
        error: (err) => this.toastr.error(err),
      });
  }

  handleDeleteProject() {
    this.projectService.deleteProject(this.projectId).subscribe({
      next: () => {
        this.toastr.success('project successfully deleted');

        this.navigateToHome();
      },
      error: (err) => {
        console.log('error:', err);
        this.toastr.error('failed to delete project');
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
