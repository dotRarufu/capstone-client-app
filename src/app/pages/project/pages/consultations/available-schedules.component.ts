import { Component, DestroyRef, inject } from '@angular/core';

import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';

import { CommonModule } from '@angular/common';

import { ConsultationStateService } from './data-access/consultations-state.service';

import { AuthService } from 'src/app/services/auth.service';

import dayFromDate from 'src/app/utils/dayFromDate';
import formatDate from 'src/app/utils/formatDate';
import getDuration from 'src/app/utils/getDuration';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import sortArrayByProperty from 'src/app/utils/sortArrayByProperty';
import { toNumericalDate } from 'src/app/utils/toNumericalDate';

@Component({
  selector: 'available-schedules',
  standalone: true,
  imports: [FeatherIconsModule, CommonModule],
  template: `
    <ng-container
      *ngIf="{
        availableSchedules: (availableSchedules$ | async) || []
      } as observables"
      ><div class="flex flex-col gap-2 pb-4">
        <div class="flex items-center justify-between text-base font-semibold">
          Available Schedule

          <div class="flex gap-2">
            <button
              onclick="addAvailableSchedule.showModal()"
              class="btn-ghost btn-sm btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
            >
              <i-feather class="text-base-content/70" name="plus" />

              Add Schedule
            </button>
            <button
              *ngIf="observables.availableSchedules.length > 1"
              (click)="invertSortOrder()"
              class="btn-ghost btn-sm flex flex-row items-center gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 font-[500] text-base-content hover:border-base-content/30"
            >
              SORT
              <i-feather
                class="text-base-content/70"
                [name]="getInvertedSort()"
              />
            </button>
          </div>
        </div>

        <button
          *ngFor="let schedule of observables.availableSchedules"
          (click)="consultationStateService.setActiveSchedule(schedule)"
          onclick="availableScheduleDetail.showModal()"
          class="grid w-full cursor-pointer grid-cols-2 gap-2 rounded-[3px] bg-base-200 px-4 py-2  hover:bg-base-300 sm1:grid-cols-4 sm1:justify-between"
        >
          <div
            class="flex gap-2  p-0 text-left   text-base  text-base-content sm1:w-fit sm1:text-[18px]"
          >
            <i-feather
              name="calendar"
              class="aspect-square w-full text-base-content/70"
            />
            {{ toNumericalDate(schedule.date) }}
          </div>
          <div
            class="flex gap-2 justify-end sm1:justify-start text-right text-base text-base-content/70 sm1:text-center"
          >
            <i-feather
              name="sun"
              class="aspect-square w-full text-base-content/70"
            />
            {{ getDayFromDate(schedule.date) }}
          </div>

          <div
            class="flex gap-2 p-0 text-left text-base text-base-content sm1:text-center sm1:text-[18px]"
          >
            <i-feather
              name="clock"
              class="aspect-square w-full text-base-content/70"
            />
            {{ getTimeFromEpoch(schedule.start_time) }}
          </div>
          <span
            class="flex items-center justify-end text-right text-base text-base-content/70 "
            > <i-feather
              name="watch"
              class="aspect-square w-full text-base-content/70"
            />{{ getDuration(schedule.start_time, schedule.end_time) }}</span
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

  destroyRef = inject(DestroyRef);
  availableSchedules$ = this.authService.getAvailableSchedules().pipe(
    takeUntilDestroyed(this.destroyRef),
    switchMap((consultations) =>
      this.sortSubject
        .asObservable()
        .pipe(map((order) => ({ order, consultations })))
    ),
    map(({ consultations, order }) =>
      sortArrayByProperty(consultations, 'date', order)
    )
  );

  sortSubject = new BehaviorSubject<'asc' | 'desc'>('asc');

  invertSortOrder() {
    const old = this.sortSubject.getValue();
    this.sortSubject.next(old === 'asc' ? 'desc' : 'asc');
  }

  getInvertedSort() {
    return this.sortSubject.getValue() === 'asc' ? 'arrow-down' : 'arrow-up';
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

  toNumericalDate(d: string) {
    return toNumericalDate(new Date(d));
  }
}
