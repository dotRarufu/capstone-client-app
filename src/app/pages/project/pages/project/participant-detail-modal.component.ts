import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { switchMap, tap } from 'rxjs';
import { MilestoneService } from 'src/app/services/milestone.service';
import { ProjectStateService } from './data-access/project-state.service';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
// import {} from 'validator';

@Component({
  selector: 'participant-detail-modal',
  standalone: true,
  imports: [
    ModalComponent,
    FeatherIconsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  template: `
    <modal inputId="participantDetail" (closed)="reset()">
      <div
        class="flex h-full w-full flex-col rounded-[3px] border border-base-content/10"
        *ngIf="{
          participant: participant$ | async,
          user: user$ | async
        } as observables"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between">
            <span
              type="text"
              placeholder="User ID"
              class="text-[20px] text-primary-content"
              >{{ observables.participant?.name }}
            </span>
          </div>
        </div>

        <div
          class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
        >
          <div
            class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4 sm1:overflow-y-auto"
          >
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Role</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <div
              class="form-control rounded-[3px] border-[1px]"
            >
              <div
                class="input-group rounded-[3px] border border-base-content/50"
              >
                <select
                  [disabled]="
                    observables.user?.uid !== observables.participant?.uid
                  "
                  [formControl]="newRole"
                  class="select-bordered select w-full rounded-[3px] border-none font-normal text-base-content  outline-0  focus:rounded-[3px] "
                >
                  <option disabled [ngValue]="''">
                    {{
                      observables.participant?.projectRole || 'Select a role'
                    }}
                  </option>

                  <ng-container *ngIf="observables.participant?.role_id === 0">
                    <option
                      [ngValue]="role"
                      *ngFor="let role of studentRoleOptions"
                    >
                      {{ role }}
                    </option>
                  </ng-container>
                </select>
              </div>
            </div>
          </div>

          <ul class="flex w-full flex-col bg-neutral/20 p-0 py-2 sm1:w-[223px]">
            <button
            onclick="participantDetail.close()"
              *ngIf="newRole.value !== ''"
              (click)="handleSaveClick(observables.participant!.uid)"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="check-square" />
              save
            </button>
            <button
            onclick="participantDetail.close()"

              *ngIf="
                observables.user?.uid !== observables.participant?.uid &&
                observables.participant?.role_id === 0 &&
                observables.user?.role_id === 0
              "
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
              (click)="handleRemoveClick(observables.participant?.uid || '')"
            >
              <i-feather class="text-base-content/70" name="check-square" />
              Remove
            </button>

            <div class="h-full"></div>
            <button
            onclick="participantDetail.close()"

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
export class ParticipntDetailModalComponent {
  projectService = inject(ProjectService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  projectStateService = inject(ProjectStateService);
  spinner = inject(NgxSpinnerService);
  showSpinner= this.spinner.show()
  participant$ = this.projectStateService.activeParticipant$.pipe(
    tap(v => this.spinner.hide())
  );
  // maybe convert getAuthentiatedUser to a state, to prevent multiple retrieval
  user$ = this.authService.getAuthenticatedUser();

  adviserRoleOptions = ['Subject Adviser', 'Technical Adviser'];
  studentRoleOptions = ['Communication', 'Developer', 'Documentation'];

  newRole = new FormControl('', {
    nonNullable: true,
  });

  handleRemoveClick(userUid: string) {
    const projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);

    this.projectService.removeProjectParticipant(userUid, projectId).subscribe({
      complete: () => {
        this.toastr.success('Successfully removed user from the project');
        this.newRole.reset();
      },
      error: () => {
        this.toastr.error('Failed to removed user from the project');
      },
    });
  }

  handleSaveClick(uid: string) {
    this.spinner.show();
    const projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);

    this.projectService
      .changeParticipantRole(uid, projectId, this.newRole.value)
      .subscribe({
        complete: () => {
          this.toastr.success(`Role updated to ${this.newRole.value}`);
          this.spinner.hide();
          this.newRole.reset();
        },
        error: () => {
          this.toastr.error('Failed to change role');
          this.spinner.hide();
        },
      });
  }

  reset() {
    this.projectStateService.setActiveParticipant(null);
  }
}
