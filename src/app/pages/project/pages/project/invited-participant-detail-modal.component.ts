import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { filter, map, switchMap } from 'rxjs';
import { MilestoneService } from 'src/app/services/milestone.service';
import { ProjectStateService } from './data-access/project-state.service';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { isNotNull } from 'src/app/utils/isNotNull';
// import {} from 'validator';

@Component({
  selector: 'invited-participant-detail-modal',
  standalone: true,
  imports: [
    ModalComponent,
    FeatherIconsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  template: `
    <modal inputId="invitedParticipantDetail" (closed)="reset()">
      <div
        class="flex h-full w-full flex-col rounded-[3px] border border-base-content/10"
        *ngIf="{
          invitedParticipant: invitedParticipant$ | async,
          user: user$ | async
        } as observables"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between">
            <span
              type="text"
              placeholder="User ID"
              class="text-[20px] text-primary-content"
              >{{ observables.invitedParticipant?.name }}
            </span>
          </div>
        </div>

        <div
          class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
        >
          <div
            class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4 sm1:overflow-y-scroll"
          >
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Role</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <div class="flex items-center justify-between ">
              <h1 class="text-[18px] text-base-content">{{observables.invitedParticipant?.role_id === 0 ? "Student" : "Adviser"}}</h1>
            </div>

          </div>

          <ul class="flex w-full flex-col bg-neutral/20 p-0 py-2 sm1:w-[223px]">

            <button
            onclick="invitedParticipantDetail.close()"
              *ngIf="observables.user?.uid !== observables.invitedParticipant?.uid"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
              (click)="handleDeleteClick(observables.invitedParticipant?.uid || '')"
            >
              <i-feather class="text-base-content/70" name="check-square" />
              Delete
            </button>

            <div class="h-full"></div>
            <button
            onclick="invitedParticipantDetail.close()"

              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="x-circle" />
              cancel
            </button>
          </ul>
        </div>
      </div>
    </modal>
  `,
})
export class InvitedParticipntDetailModalComponent {
  projectService = inject(ProjectService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  projectStateService = inject(ProjectStateService);
  spinner = inject(NgxSpinnerService);

  invitedParticipant$ = this.projectStateService.activeInvitedParticipant$;
  // maybe convert getAuthentiatedUser to a state, to prevent multiple retrieval
  user$ = this.authService.getAuthenticatedUser();


  handleDeleteClick(userUid: string) {
    this.spinner.show();
    const projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);

    this.user$.pipe(
      filter(isNotNull),
      switchMap(sender => this.projectService.cancelInvitation(projectId, sender.uid, userUid))
    ).subscribe({
      complete: () => {
        this.spinner.hide();
        this.toastr.success('Canceled project invitation');
      },
      error: () => {
        this.toastr.error('Failed to cancel invitation');
      },
    });
  }


  reset() {
    this.projectStateService.setActiveInvitedParticipant(null);
  }
}
