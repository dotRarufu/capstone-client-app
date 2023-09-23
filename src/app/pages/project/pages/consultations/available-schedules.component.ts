import { Component, DestroyRef, inject } from '@angular/core';

import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';

import { CommonModule } from '@angular/common';

import { ConsultationStateService } from './data-access/consultations-state.service';

import { AuthService } from 'src/app/services/auth.service';

import dayFromDate from 'src/app/utils/dayFromDate';
import formatDate from 'src/app/utils/formatDate';
import getDuration from 'src/app/utils/getDuration';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';

@Component({
  selector: 'available-schedules',
  standalone: true,
  imports: [FeatherIconsModule, CommonModule],
  template: `
    <ng-container
      *ngIf="{ availableSchedules: availableSchedules$ | async } as observables"
      ><div class="flex flex-col gap-2">
        <div class="flex items-center justify-between text-base font-semibold">
          Available Schedule

          <button
            onclick="addAvailableSchedule.showModal()"
            class="btn-ghost btn-sm btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
          >
            <i-feather class="text-base-content/70" name="plus" />

            Add
          </button>
        </div>

        <button
          *ngFor="let schedule of observables.availableSchedules"
          (click)="consultationStateService.setActiveSchedule(schedule)"
          onclick="availableScheduleDetail.showModal()"
          class="grid w-full cursor-pointer grid-cols-2 gap-2 rounded-[3px] bg-base-200 px-4 py-2  hover:bg-base-300 sm1:grid-cols-4 sm1:justify-between"
        >
          <div
            class="p-0 text-left  text-base text-base-content sm1:w-fit sm1:grid sm1:place-content-center sm1:text-[18px]"
          >
            {{ formatDate(schedule.date) }}
          </div>
          <div
            class="text-right text-base text-base-content/70 sm1:text-center sm1:grid sm1:place-content-center"
          >
            {{ getDayFromDate(schedule.date) }}
          </div>

          <div
            class="p-0 text-left text-base text-base-content sm1:text-center  sm1:text-[18px] sm1:grid sm1:place-content-center"
          >
            {{ getTimeFromEpoch(schedule.start_time) }}
          </div>
          <span
            class="flex items-center justify-end text-right text-base text-base-content/70 "
            >{{ getDuration(schedule.start_time, schedule.end_time) }}</span
          >
        </button>

        <div
          *ngIf="observables.availableSchedules?.length === 0"
          class="flex w-full items-center justify-center rounded-[5px] bg-base-200 p-4 text-base-content/70"
        >
          You have not added any available schedules yet
        </div>
      </div>
    </ng-container>
  `,
})
export class AvailableSchedulesComponent {
  authService = inject(AuthService);
  consultationStateService = inject(ConsultationStateService);

  availableSchedules$ = this.authService.getAvailableSchedules();

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
}
