import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable, filter, map, switchMap, tap } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';
import { Consultation, Task } from 'src/app/types/collection';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { isNotNull } from 'src/app/utils/isNotNull';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';
import { CommonModule } from '@angular/common';
import { ProfileStateService } from './data-access/profile-state.service';
import { ConsultationService } from 'src/app/services/consultation.service';
import dateToEpoch from 'src/app/utils/dateToEpoch';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'schedule-notification-details-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, FeatherIconsModule],
  template: `
    <modal
      inputId="scheduleNotificationDetailsModal"
      *ngIf="{ schedule: schedule$ | async } as observables"
    >
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex h-full items-center justify-between bg-primary p-[24px]">
          <h1 class="h-fit text-[20px] text-primary-content">
            {{ observables.schedule?.formattedStartTime }}
          </h1>
        </div>
        <div
          class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
        >
          <div
            class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4 sm1:overflow-y-scroll"
          >
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Time</h1>
            </div>

            <div class="text-base text-base-content">
              {{ observables.schedule?.startTime }} to
              {{ observables.schedule?.endTime }}
            </div>
            <div class="h-[2px] w-full bg-base-content/10"></div>
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Location</h1>
            </div>

            <div class="text-base text-base-content">
              {{ observables.schedule?.consultationData?.location }}
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Scheduled by</h1>
            </div>

            <div class="text-base text-base-content">
              {{
                observables.schedule?.assigner?.name
              }}
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Project</h1>
            </div>
            <div class="text-base text-base-content">
              {{ observables.schedule?.project?.name }}
            </div>
          </div>
          <ul
            class="flex h-full w-full flex-col  bg-neutral/20 p-0 py-2 sm1:w-[223px]"
          >
            <ng-content />

            <button
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
              (click)="confirmSchedule(observables.schedule!.id)"
            >
              <i-feather class="text-base-content/70" name="x" /> Confirm
            </button>
            <div class="h-full"></div>

            <button
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="x" /> close
            </button>
          </ul>
        </div>
      </div>
    </modal>
  `,
})
export class ScheduleNotificationDetailsModalComponent {
  profileStateService = inject(ProfileStateService);
  consultationService = inject(ConsultationService);
  authService = inject(AuthService);
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService)

  schedule$ = this.profileStateService.selectedScheduleNotification$.pipe(
    filter(isNotNull),
    switchMap((s) => {
      const date = new Date(s.date);
      const time = new Date(0);
      time.setUTCSeconds(s.start_time);

      const hours = time.getHours();
      const minutes = time.getMinutes();
      const seconds = time.getSeconds();
      const milliseconds = time.getMilliseconds();

      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(seconds);
      date.setMilliseconds(milliseconds);

      return this.consultationService
        .getConsultationData(s.project.id, dateToEpoch(date))
        .pipe(map((p) => ({ ...s, consultationData: p })));
    }),
    map(p => ({...p, startTime: getTimeFromEpoch(p.start_time), endTime: getTimeFromEpoch(p.end_time)})),
    switchMap(p => this.authService.getUserData(p.consultationData.organizer_id).pipe(map(d => ({...p, assigner: d}))))
  );

  confirmSchedule(id: number) {
    this.spinner.show();

    this.authService.confirmScheduleNotification(id).subscribe({
      complete: () => {
        this.spinner.hide();
        this.toastr.success('Schedule confirmed');
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Failed to confirm schedule');
      },
    });
  }

}
