import { Component, inject } from '@angular/core';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { ProjectService } from 'src/app/services/project.service';
import { HomeStateService } from './data-access/home-state.service';
import { map, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'remove-project-modal',
  standalone: true,
  imports: [ModalComponent],
  template: `
    <modal inputId="removeProjectModal">
      <div
        class="sm1:w-sm flex w-full flex-col items-center gap-6 rounded-[3px] border border-base-content/10 bg-base-100 p-4"
      >
        <h2 class="text-[18px] text-base-content">
          Are you sure you want to remove this project?
        </h2>
        <div class=" flex w-full">
          <button
          onclick="removeProjectModal.close()"
          class=" btn-ghost btn w-1/2 text-error">No</button>
          <button
          onclick="removeProjectModal.close()"

            (click)="removeProjectCard()"
            class="btn-ghost btn w-1/2 text-success"
          >
            Yes
          </button>
        </div>
      </div>
    </modal>
  `,
})
export class RemoveProjectModalComponent {
  projectService = inject(ProjectService);
  homeStateService = inject(HomeStateService);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);

  removeProjectCard() {
    this.spinner.show();
    const removeProject$ = this.homeStateService.activeProjectId$.pipe(
      map((id) => {
        if (id === null) throw new Error('No project id passed');

        return id;
      }),
      switchMap((id) => this.projectService.removeProject(id))
    );

    removeProject$.subscribe({
      next: (res) => {
        this.spinner.hide();
        this.toastr.success('Project removed successfully')},
      error: (err) => {
        this.spinner.hide();
        this.toastr.error('Failed to remove project')},
    });
  }
}
