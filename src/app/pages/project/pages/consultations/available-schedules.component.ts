import { Component, DestroyRef, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccordionComponent } from 'src/app/components/ui/accordion.component';
import { ConsultationCardComponent } from 'src/app/pages/project/pages/consultations/card.component';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ConsultationService } from 'src/app/services/consultation.service';
import { Consultation } from 'src/app/types/collection';
import { ConsultationDetailsModalComponent } from 'src/app/pages/project/pages/consultations/consultation-details-modal.component';
import { CommonModule } from '@angular/common';
import { ScheduleConsultationModalComponent } from './schedule-consultation-modal.component';
import { CompletedConsultationModalComponent } from './completed-consultation-modal.component';
import { ActivatedRoute } from '@angular/router';
import { ScheduledConsultationModalComponent } from './scheduled-consultation-modal.component';
import { ConsultationStateService } from './data-access/consultations-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectService } from 'src/app/services/project.service';
import { AuthService } from 'src/app/services/auth.service';
import { filter, map, switchMap, of, tap } from 'rxjs';
import { isNotNull } from 'src/app/utils/isNotNull';
import { AvailableScheduleDetailModalComponent } from './available-schedule-detail-modal.component';
import { AddAvailableScheduleModalComponent } from './add-available-schedule-modal.component';
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
    >
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
        class="grid w-full cursor-pointer grid-cols-2 gap-2 rounded-[3px] px-4 py-2  hover:bg-base-200 sm1:grid-cols-4 sm1:justify-items-center"
      >
        <div
          class="p-0 text-left  text-base text-base-content sm1:w-fit sm1:text-center   sm1:text-[18px]"
        >
          {{ getDayFromDate(schedule.date) }}
        </div>
        <div class="text-right text-base text-base-content/70 sm1:text-center">
          {{ formatDate(schedule.date) }}
        </div>

        <div
          class="p-0 text-left text-base text-base-content sm1:w-fit sm1:text-center  sm1:text-[18px]"
        >
          {{ getTimeFromEpoch(schedule.start_time) }}
        </div>
        <span
          class="text-right text-base text-base-content/70 sm1:w-fit sm1:text-center"
          >{{ getDuration(schedule.start_time, schedule.end_time) }}</span
        >
      </button>

      <div *ngIf="observables.availableSchedules?.length === 0">
        You have not added available schedules yet
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
