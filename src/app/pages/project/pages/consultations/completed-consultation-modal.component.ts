import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, map, switchMap, tap } from 'rxjs';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import { TaskService } from 'src/app/services/task.service';
import { ConsultationService } from 'src/app/services/consultation.service';
import { AuthService } from 'src/app/services/auth.service';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { AccomplishmentsComponent } from 'src/app/pages/project/pages/consultations/accomplishments.component';
import { OutcomeComponent } from 'src/app/pages/project/pages/consultations/outcome.component';
import { ConsultationStateService } from './data-access/consultations-state.service';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { isNotNull } from 'src/app/utils/isNotNull';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    OutcomeComponent,
    ModalComponent,
    AccomplishmentsComponent,
    FeatherIconsModule,
  ],
  selector: 'completed-consultation-modal',
  template: `
    <modal inputId="completedConsultationsModal">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
        *ngIf="{ consultation: consultation$ | async } as observables"
      >
        <div class="flex h-full justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between gap-4">
            <h1 class="text-[20px] text-primary-content">
              {{ epochToDate(observables.consultation?.date_time || 0) }}
              {{ epochToTime(observables.consultation?.date_time || 0) }}
            </h1>
          </div>
        </div>
        <div
          class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
        >
          <div
            class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4 sm1:overflow-y-scroll"
          >
          <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Description</h1>
            </div>

            <div class="text-base text-base-content">
              {{ observables.consultation?.description }}
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Time</h1>
            </div>

            <div class="text-base text-base-content">
              {{ observables.consultation?.scheduleData?.startTime }} to
              {{ observables.consultation?.scheduleData?.endTime }}
            </div>
            <div class="h-[2px] w-full bg-base-content/10"></div>
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Location</h1>
            </div>

            <div class="text-base text-base-content">
              {{ observables.consultation?.location }}
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Scheduled by</h1>
            </div>

            <div class="text-base text-base-content">
              {{ observables.consultation?.organizer?.name }}
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Project</h1>
            </div>
            <div class="text-base text-base-content">
              {{ observables.consultation?.project?.name }}
            </div>

            <accomplishments
              [hideInput]="true"
              [data]="(accomplishedTasks$ | async) || []"
            />

            <outcome
              heading="Actual Accomplishments"
              [hideInput]="true"
              [data]="(actualAccomplishments$ | async) || []"
            />

            <outcome
              heading="Proposed Next Steps"
              [hideInput]="true"
              [data]="(proposedNextSteps$ | async) || []"
            />

            <outcome
              heading="Next Deliverables"
              [hideInput]="true"
              [data]="(nextDeliverables$ | async) || []"
            />
          </div>

          <ul
            class="flex h-full w-full flex-col  bg-neutral/20 p-0 py-2 sm1:w-[223px]"
          >
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
export class CompletedConsultationModalComponent {
  consultationStateService = inject(ConsultationStateService);
  taskService = inject(TaskService);
  consultationService = inject(ConsultationService);
  authService = inject(AuthService);
  projectService = inject(ProjectService);

  consultation$ = this.consultationStateService.consultation$.pipe(
    filter(isNotNull),
    switchMap((consultation) =>
      this.authService
        .getScheduleData(consultation.schedule_id)
        .pipe(map((d) => ({ ...consultation, scheduleData: d })))
    ),
    map((consultation) => ({
      ...consultation,
      scheduleData: {
        ...consultation.scheduleData,
        startTime: getTimeFromEpoch(consultation.scheduleData.start_time),
        endTime: getTimeFromEpoch(consultation.scheduleData.end_time),
      },
    })),

    switchMap((consultation) =>
      this.authService
        .getUserData(consultation.organizer_id)
        .pipe(map((data) => ({ ...consultation, organizer: data })))
    ),
    switchMap((consultation) =>
      this.projectService.getProjectInfo(consultation.project_id).pipe(
        map((projectData) => ({
          ...consultation,
          project: projectData,
        }))
      )
    )
  );

  accomplishedTasks$ = this.consultation$.pipe(
    switchMap((c) => this.taskService.getAccompishedTasks(c.id))
  );

  res$ = this.consultation$.pipe(
    switchMap(({ id }) => this.consultationService.getConsultationOutcomes(id))
  );

  actualAccomplishments$ = this.res$.pipe(
    map((res) => res.actualAccomplishments)
  );
  proposedNextSteps$ = this.res$.pipe(map((res) => res.proposedNextSteps));
  nextDeliverables$ = this.res$.pipe(map((res) => res.nextDeliverables));

  epochToDate(epoch: number) {
    return convertUnixEpochToDateString(epoch);
  }

  epochToTime(epoch: number) {
    return getTimeFromEpoch(epoch);
  }
}
