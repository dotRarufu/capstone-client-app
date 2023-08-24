import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { from, map, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { User } from 'src/app/types/collection';
import { getRolePath } from 'src/app/utils/getRolePath';

@Component({
  selector: 'danger-zone',
  standalone: true,
  template: `
    <div class="flex flex-col gap-[16px]">
      <div class="flex items-center justify-between ">
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
export class DangerZoneComponent implements OnInit {
  projectId = -1;
  user: User | null = null;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

    navigateToHome() {
      if (this.user === null) throw new Error('impossible');
      // move this inside a pipe
      if (this.user.role_id === null) throw new Error('user has no role id');

      const rolePath = getRolePath(this.user.role_id);

      if (rolePath === 's') {
        this.router.navigate([rolePath, 'home']);
        return;
      }

      this.router.navigate(['a', rolePath, 'home']);
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
    if (this.user === null) throw new Error('impossible');

    this.projectService
      .removeProjectParticipant(this.user.uid, this.projectId, true)
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

  ngOnInit(): void {
    this.projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);

    from(this.authService.getAuthenticatedUser())
      .pipe(
        map((user) => {
          if (user === null) throw new Error('no authenticated user');

          return user;
        })
      )
      .subscribe({
        next: (user) => {
          this.user = user;
        },
      });
  }
}
