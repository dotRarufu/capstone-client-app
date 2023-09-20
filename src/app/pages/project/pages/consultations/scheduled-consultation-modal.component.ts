import { Component, inject, signal } from '@angular/core';
import { filter, map, switchMap, tap } from 'rxjs';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import { TaskService } from 'src/app/services/task.service';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ProjectService } from 'src/app/services/project.service';
import { ToastrService } from 'ngx-toastr';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { AccomplishmentsComponent } from 'src/app/pages/project/pages/consultations/accomplishments.component';
import { OutcomeComponent } from 'src/app/pages/project/pages/consultations/outcome.component';
import { ConsultationStateService } from './data-access/consultations-state.service';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { isNotNull } from 'src/app/utils/isNotNull';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FeatherIconsModule,
    ModalComponent,
    AccomplishmentsComponent,
    OutcomeComponent,
  ],
  selector: 'scheduled-consultation-modal',
  template: `
    <modal inputId="scheduledConsultationsModal">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
        *ngIf="{ consultation: consultation$ | async } as observables"
      >
        <div
          class="flex h-full items-center justify-between bg-primary p-[24px]"
        >
          <h1 class="text-[20px] text-primary-content">
            {{ epochToDate(observables.consultation?.date_time || 0) }}
            {{ epochToTime(observables.consultation?.date_time || 0) }}
          </h1>
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
            <accomplishments [data]="(accomplishedTasks$ | async) || []" />

            <outcome
              heading="Actual Accomplishments"
              (addItem)="addActualAccomplishment($event)"
              (deleteItem)="deleteActualAccomplishment($event)"
              [data]="actualAccomplishments()"
            />

            <outcome
              heading="Proposed Next Steps"
              (addItem)="addProposedNextStep($event)"
              (deleteItem)="deleteProposedNextStep($event)"
              [data]="proposedNextSteps()"
            />

            <outcome
              heading="Next Deliverables"
              (addItem)="addNextDeliverable($event)"
              (deleteItem)="deleteNextDeliverable($event)"
              [data]="nextDeliverables()"
            />
          </div>

          <ul
            class="flex h-full w-full flex-col  bg-neutral/20 p-0 py-2 sm1:w-[223px]"
          >
            <button
              (click)="handleCompleteClick()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="check-circle" />
              Complete
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
export class ScheduledConsultationModalComponent {
  taskService = inject(TaskService);
  consultationService = inject(ConsultationService);
  projectService = inject(ProjectService);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  consultationStateService = inject(ConsultationStateService);

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

  actualAccomplishments = signal<string[]>([]);
  proposedNextSteps = signal<string[]>([]);
  nextDeliverables = signal<string[]>([]);

  handleCompleteClick() {
    const consultation = this.consultationStateService.getActiveConsultation();

    if (consultation === null) throw new Error('cant do this without id');
    this.spinner.show();

    const id = consultation.id;
    const completeScheduled = this.consultationService.completeScheduled(
      id,
      this.actualAccomplishments(),
      this.proposedNextSteps(),
      this.nextDeliverables()
    );
    completeScheduled.subscribe({
      next: (res) => {
        this.spinner.hide();
        this.toastr.success('success');
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err);
      },
    });
  }

  addNextDeliverable(value: string) {
    this.nextDeliverables.update((old) => [...old, value]);
  }
  addProposedNextStep(value: string) {
    this.proposedNextSteps.update((old) => [...old, value]);
  }
  addActualAccomplishment(value: string) {
    this.actualAccomplishments.update((old) => [...old, value]);
  }
  deleteNextDeliverable(value: string) {
    this.nextDeliverables.update((old) => old.filter((v) => v !== value));
  }
  deleteProposedNextStep(value: string) {
    this.proposedNextSteps.update((old) => old.filter((v) => v !== value));
  }
  deleteActualAccomplishment(value: string) {
    this.actualAccomplishments.update((old) => old.filter((v) => v !== value));
  }

  epochToDate(epoch: number) {
    return convertUnixEpochToDateString(epoch);
  }

  epochToTime(epoch: number) {
    return getTimeFromEpoch(epoch);
  }
}
