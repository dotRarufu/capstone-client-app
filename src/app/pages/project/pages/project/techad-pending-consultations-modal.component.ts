import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewChildren,
  inject,
  signal,
} from '@angular/core';
import { EMPTY, Observable, filter, map, of, switchMap, tap } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';
import { ProjectService } from 'src/app/services/project.service';
import { AuthService } from 'src/app/services/auth.service';
import { Consultation, Task } from 'src/app/types/collection';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';

import { ModalComponent } from 'src/app/components/ui/modal.component';
import { isNotNull } from 'src/app/utils/isNotNull';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';
import { CommonModule } from '@angular/common';
import { ModalDialog } from 'src/app/pages/home/scheduled-consultation-details-modal.component';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ToastrService } from 'ngx-toastr';
import { AccomplishmentsComponent } from '../consultations/accomplishments.component';
import { ConsultationStateService } from '../consultations/data-access/consultations-state.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'techad-pending-consultations-modal',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    FeatherIconsModule,
    AccomplishmentsComponent,
    ReactiveFormsModule,
  ],
  template: `
    <modal
      [inputId]="'techAdPendingConsultationsModal'"
      (close)="inDecline.set(false)"
    >
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
        *ngIf="{
          accomplishedTasks: accomplishedTasks$ | async,
          consultation: consultation$ | async
        } as observables"
      >
        <div class="flex h-full items-center bg-primary p-[24px]">
          <h1 class="text-[20px] text-primary-content" *ngIf="!inDecline()">
            {{ epochToDate(observables.consultation?.date_time || 0) }}
            {{ epochToTime(observables.consultation?.date_time || 0) }}
          </h1>
          <h1 class="text-[20px] text-primary-content" *ngIf="inDecline()">
            Decline reason
          </h1>
        </div>
        <div
          class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
        >
          <div
            *ngIf="inDecline()"
            class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4 sm1:overflow-y-auto"
          >
            <textarea
              [formControl]="declineReason"
              class="textarea h-[117px] w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 leading-normal text-base-content placeholder:text-base-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0"
              placeholder="Type something"
            ></textarea>
          </div>
          <div
            *ngIf="!inDecline()"
            class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4 sm1:overflow-y-auto"
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
              [data]="observables.accomplishedTasks || []"
              [hideInput]="true"
            />
          </div>
          <ul
            class="flex h-full w-full flex-col  bg-neutral/20 p-0 py-2 sm1:w-[223px]"
          >
            <button
              *ngIf="!inDecline()"
              onclick="techAdPendingConsultationsModal.close()"
              (click)="handleInvitation(true)"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="check" /> Accept
            </button>
            <button
              
              *ngIf="!inDecline()"
              (click)="inDecline.set(true)"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="x-circle" /> Decline
            </button>
            <button
              onclick="techAdPendingConsultationsModal.close()"
              *ngIf="inDecline()"
              (click)="handleInvitation(false); inDecline.set(false)"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="check" /> Confirm
            </button>

            <div class="h-full"></div>

            <button
              onclick="techAdPendingConsultationsModal.close()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
              (click)="inDecline.set(false)"
            >
              <i-feather class="text-base-content/70" name="x" />
              {{ !inDecline() ? 'close' : 'cancel' }}
            </button>
          </ul>
        </div>
      </div>
    </modal>
  `,
})
export class TechAdPendingConsultationsModalComponent {
  taskService = inject(TaskService);
  consultationStateService = inject(ConsultationStateService);
  authService = inject(AuthService);
  projectService = inject(ProjectService);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  consultationService = inject(ConsultationService);

  inDecline = signal(false);
  declineReason = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  showSpinner = this.spinner.show();

  consultation$ = this.consultationStateService.consultation$.pipe(
    switchMap((v) => {
      if (v === null) {
        this.spinner.hide();
        return EMPTY;
      }

      return of(v);
    }),
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
    ),
    tap(() => this.spinner.hide())
  );

  accomplishedTasks$ = this.consultation$.pipe(
    switchMap((c) => this.taskService.getAccompishedTasks(c.id))
  );

  epochToDate(epoch: number) {
    return convertUnixEpochToDateString(epoch);
  }

  epochToTime(epoch: number) {
    return getTimeFromEpoch(epoch);
  }

  @ViewChild(ModalComponent, { static: false }) modalComponent!: ModalComponent;

  handleInvitation(decision: boolean) {
    if (this.declineReason.invalid) {
      this.toastr.error('Decline reason cannot be empty');

      return;
    }

    this.spinner.show();
    const activeConsultation =
      this.consultationStateService.getActiveConsultation()!;

    const id = activeConsultation.id;

    this.consultationService
      .handleInvitation(id, decision, this.declineReason.value)
      .subscribe({
        next: (res) => {
          this.spinner.hide();
          this.toastr.success(
            `Consultation has been ${decision ? 'accepted' : 'declined'}`
          );
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error("Error occured: " + err);
        },
      });
  }
}
