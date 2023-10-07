import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { filter, switchMap, tap } from 'rxjs';
import { MilestoneService } from 'src/app/services/milestone.service';

import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectStateService } from '../project/data-access/project-state.service';
import { ConsultationStateService } from './data-access/consultations-state.service';
import { isNotNull } from 'src/app/utils/isNotNull';
import dayFromDate from 'src/app/utils/dayFromDate';
import getDuration from 'src/app/utils/getDuration';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import formatDate from 'src/app/utils/formatDate';
import timeToEpoch from 'src/app/utils/timeToEpoch';
import epochTo24hour from 'src/app/utils/epochTo24hour';
// import {} from 'validator';

@Component({
  selector: 'available-schedule-detail-modal',
  standalone: true,
  imports: [
    ModalComponent,
    FeatherIconsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  template: `
    <modal
      inputId="availableScheduleDetail"
      (closed)="reset()"
      *ngIf="{ activeSchedule: activeSchedule$ | async } as observables"
    >
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex h-fit justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between gap-4">
            <h1 *ngIf="!isInEdit()" class="text-[24px] text-primary-content">
              {{ formatDate(observables.activeSchedule?.date || '') }}
            </h1>
            <input
              *ngIf="isInEdit()"
              [formControl]="date"
              type="date"
              class="input w-full rounded-[3px] border-y-0 border-l-[3px] border-r-0 border-l-primary-content/50 bg-transparent px-3 py-2 text-[20px] text-base text-primary-content/70 placeholder:text-[20px] placeholder:text-primary-content/70 placeholder:opacity-70 focus:border-l-[3px] focus:border-l-secondary focus:outline-0 "
            />
          </div>
        </div>
        <div
          class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
        >
          <div
            class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4 sm1:overflow-y-auto"
          >
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Time</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <div *ngIf="!isInEdit()" class="text-base text-base-content">
              <span>{{
                getTimeFromEpoch(observables.activeSchedule?.start_time || 0)
              }}</span>
              <span> - </span>
              <span>{{
                getTimeFromEpoch(observables.activeSchedule?.end_time || 0)
              }}</span>
            </div>
            <div *ngIf="isInEdit()" class="flex items-center justify-between gap-2">
            <span class="text-base-content"> FROM </span>

              <input
                type="time"
                [formControl]="startDate"
                placeholder="Start"
                class="bg-base input w-full rounded-[3px] px-3 py-2 text-base text-base-content placeholder:text-base placeholder:text-base-content placeholder:opacity-70 focus:border-l-[3px] focus:border-l-secondary focus:outline-0 "
              />
              <span class="text-base-content"> TO </span>
              <input
                type="time"
                [formControl]="endDate"
                placeholder="End"
                class="bg-base input w-full rounded-[3px] px-3 py-2 text-base text-base-content placeholder:text-base placeholder:text-base-content placeholder:opacity-70 focus:border-l-[3px] focus:border-l-secondary focus:outline-0 "
              />
            </div>
          </div>

          <ul class="flex w-full flex-col bg-neutral/20 p-0 py-2 sm1:w-[223px]">
            <button
            onclick="availableScheduleDetail.close()"
              *ngIf="isInEdit()"
              (click)="handleSaveClick()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="save" />
              save
            </button>
            <button
            
              *ngIf="!isInEdit()"
              (click)="isInEdit.set(true)"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="check-square" />
              Edit
            </button>
            <button
            onclick="availableScheduleDetail.close()"

              *ngIf="!isInEdit()"
              (click)="handleRemoveClick()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="trash" />
              Delete
            </button>

            <div class="h-full"></div>
            <button
            onclick="availableScheduleDetail.close()"

              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="x-circle" />
              {{ isInEdit() ? 'Cancel' : 'Close' }}
            </button>
          </ul>
        </div>
      </div>
    </modal>
  `,
})
export class AvailableScheduleDetailModalComponent {
  projectService = inject(ProjectService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  projectStateService = inject(ProjectStateService);
  spinner = inject(NgxSpinnerService);

  startDate = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  endDate = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  date = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  consultationStateService = inject(ConsultationStateService);

  activeSchedule$ = this.consultationStateService.activeSchedule$.pipe(
    filter(isNotNull),
    tap((v) => {
      this.startDate.setValue(epochTo24hour(v.start_time));
      this.endDate.setValue(epochTo24hour(v.end_time));
      this.date.setValue(v.date);
    })
  );
 
  participant$ = this.projectStateService.activeParticipant$;
  // maybe convert getAuthentiatedUser to a state, to prevent multiple retrieval
  user$ = this.authService.getAuthenticatedUser();

  adviserRoleOptions = ['Subject Adviser', 'Technical Adviser'];
  studentRoleOptions = ['Communication', 'Developer', 'Documentation'];

  isInEdit = signal(false);

  handleRemoveClick() {
    if (this.startDate.invalid) {
      this.toastr.error("Start time cannot be empty");

      return;
    }
    if (this.endDate.invalid) {
      this.toastr.error("End time cannot be empty");

      return;
    }
    if (this.date.invalid) {
      this.toastr.error("Date cannot be empty");

      return;
    }

    this.spinner.show();
    const id = this.consultationStateService.getActiveSchedule()!.id;

    this.authService.deleteAvailableSchedule(id).subscribe({
      complete: () => {
        this.toastr.success('Removed schedule');
        this.spinner.hide();
        this.consultationStateService.setActiveSchedule(null);
      },
      error: () => {
        this.toastr.error('Failed to remove schedule');
        this.spinner.hide();
      },
    });
  }

  handleSaveClick() {
    this.spinner.show();
    const id = this.consultationStateService.getActiveSchedule()!.id;
    const startDate = timeToEpoch(this.startDate.value);
    const endDate = timeToEpoch(this.endDate.value);

    this.authService
      .editAvailableSchedule(id, this.date.value, startDate, endDate)
      .subscribe({
        complete: () => {
          this.toastr.success(`Schedule editted`);
          this.spinner.hide();
          this.consultationStateService.setActiveSchedule(null);
        },
        error: () => {
          this.toastr.error('Failed to edit schedule');
          this.spinner.hide();
        },
      });
  }

  getDayFromDate(d: string) {
    return dayFromDate(new Date(d));
  }

  formatDate(d: string) {
    return formatDate(new Date(d));
  }

  getDuration(start: number, end: number) {
    return getDuration(start, end);
  }

  getTimeFromEpoch(t: number) {
    return getTimeFromEpoch(t);
  }

  reset() {
    this.isInEdit.set(false);
  }
}
