import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { EMPTY, Observable, filter, map, of, switchMap, tap } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';
import { ProjectService } from 'src/app/services/project.service';
import { AuthService } from 'src/app/services/auth.service';
import { Consultation, Task } from 'src/app/types/collection';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { AccomplishmentsComponent } from './accomplishments.component';
import { ConsultationStateService } from './data-access/consultations-state.service';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { isNotNull } from 'src/app/utils/isNotNull';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';
import { CommonModule } from '@angular/common';
import { ModalDialog } from 'src/app/pages/home/scheduled-consultation-details-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'declined-consultation-modal',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    FeatherIconsModule,
    AccomplishmentsComponent,
  ],
  template: `
    <modal [inputId]="'declinedConsultationModal'">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
        *ngIf="{
          accomplishedTasks: accomplishedTasks$ | async,
          consultation: consultation$ | async
        } as observables"
      >
        <div class="flex h-full items-center bg-primary p-[24px]">
          
            <h1 class="text-[20px] text-primary-content">
              {{ epochToDate(observables.consultation?.date_time || 0) }}
              {{ epochToTime(observables.consultation?.date_time || 0) }}
            </h1>
         
        </div>
        <div
          class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
        >
          <div
            class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4 sm1:overflow-y-auto"
          >
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Decline Reason</h1>
            </div>

            <div class="text-base text-base-content">
              {{ observables.consultation?.decline_reason }}
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

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
            <ng-content />

            <div class="h-full"></div>

            <button
              (click)="closeModal()"
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
export class DeclinedConsultationModalComponent {
 
  taskService = inject(TaskService);
  consultationStateService = inject(ConsultationStateService);
  authService = inject(AuthService);
  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);
  showSpinner = this.spinner.show()
  consultation$ = this.consultationStateService.consultation$.pipe(
    switchMap(v => {
      if (v ===null) {
        this.spinner.hide()
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

  closeModal() {
    this.modalComponent.close();
  }
}
