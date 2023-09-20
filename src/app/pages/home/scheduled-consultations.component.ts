import { Component, Input, OnInit, inject } from '@angular/core';
import {
  Observable,
  catchError,
  filter,
  forkJoin,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { TaskService } from 'src/app/services/task.service';
import { Consultation, Task } from 'src/app/types/collection';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { isNotNull } from 'src/app/utils/isNotNull';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';
import { CommonModule } from '@angular/common';

import { ConsultationService } from 'src/app/services/consultation.service';
import dateToEpoch from 'src/app/utils/dateToEpoch';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HomeStateService } from './data-access/home-state.service';
import { ProjectService } from 'src/app/services/project.service';
import { ConsultationDetailsModalComponent } from '../project/pages/consultations/consultation-details-modal.component';
import { ScheduledConsultationDetailsModalComponent } from './scheduled-consultation-details-modal.component';
import combineDateAndTime from 'src/app/utils/combineDateAndTime';
import separateDateAndTime from 'src/app/utils/separateDateAndTime';
import { dateToDateString } from 'src/app/utils/dateToDateString';
import epochTo24hour from 'src/app/utils/epochTo24hour';
import toScheduleDateField from 'src/app/utils/toScheduleDateField';
import getUniqueItems from 'src/app/utils/getUniqueItems';

@Component({
  selector: 'scheduled-consultations',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    FeatherIconsModule,
    ScheduledConsultationDetailsModalComponent,
  ],
  template: `
    <div
      class="flex w-full flex-col gap-[1rem] sm2:w-[840px] md:w-full lg:w-full "
      *ngIf="{ consultations: consultations$ | async } as observables"
    >
      <div
        class="flex flex-col gap-2 sm1:flex-row sm1:items-center sm1:justify-between"
      >
        <h2 class="text-2xl">Scheduled Consultations</h2>
      </div>
      <div class="h-[2px] w-full bg-base-content/10"></div>
      <ul>
        <li
          onclick="consultationModal.showModal()"
          *ngFor="let consultation of observables.consultations"
          (click)="homeStateService.setActiveConsultation(consultation)"
          class="grid w-full cursor-pointer grid-cols-2 gap-2 rounded-[3px] px-4 py-2  hover:bg-base-200 sm1:grid-cols-4 sm1:justify-items-center"
        >
          <div
            class="p-0 text-left  text-base text-base-content sm1:w-fit sm1:text-center   sm1:text-[18px]"
          >
            {{ consultation.dateString }}
          </div>
          <div
            class="text-right text-base text-base-content/70 sm1:text-center"
          >
            {{ consultation.location }}
          </div>

          <div
            class="p-0 text-left text-base text-base-content sm1:w-fit sm1:text-center  sm1:text-[18px]"
          >
            {{ consultation.description }}
          </div>
          <span
            class="text-right text-base text-base-content/70 sm1:w-fit sm1:text-center"
            >{{ consultation.project.name }}</span
          >
        </li>
      </ul>

      <div
        class="flex w-full items-center justify-center rounded-[5px] bg-base-200 p-4 text-base-content/70"
        *ngIf="observables.consultations?.length === 0"
      >
        You have no more scheduled consultations
      </div>
    </div>

    <scheduled-consultation-details-modal />
  `,
})
export class ScheduledConsultationsComponent {
  homeStateService = inject(HomeStateService);
  consultationService = inject(ConsultationService);
  projectService = inject(ProjectService);
  authService = inject(AuthService);
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService);
  showSpinner = this.spinner.show();
  rawConsultations$ = this.projectService.getProjects().pipe(
    filter(isNotNull),
    map((projects) => {
      if (projects.length === 0) throw new Error('User has no projects');

      return projects;
    }),
    map((projects) => projects.map(({ id }) => id)),

    switchMap((projectIds) => {
      const projectsConsultations = projectIds.map((id) =>
        this.consultationService.getConsultations(1, id).pipe(take(1))
      );

      return forkJoin(projectsConsultations);
    }),
    map((consultations) => consultations.flat())
  );
  consultations$ = this.authService.getAuthenticatedUser().pipe(
    filter(isNotNull),
    switchMap((_) => this.consultationService.newConsultation$),

    switchMap((u) => this.rawConsultations$),

    map((consultations) =>
      consultations.map((consultation) => ({
        ...consultation,
        dateString: convertUnixEpochToDateString(consultation.date_time),
      }))
    ),

    switchMap((consultations) => {
      if (consultations.length === 0) return of([]);

      const uniqueProjects = getUniqueItems(consultations, 'project_id');

      const projectsData$ = forkJoin(
        uniqueProjects.map(({ project_id }) =>
          this.projectService.getProjectInfo(project_id)
        )
      );

      const transformed$ = projectsData$.pipe(
        map((projectsData) =>
          projectsData
            .map((projectData) =>
              consultations
                .filter(
                  (consultation) => consultation.project_id === projectData.id
                )
                .map((consultation) => ({
                  ...consultation,
                  project: projectData,
                }))
            )
            .flat(1)
        )
      );

      return transformed$;
    }),
    switchMap((consultations) => {
      if (consultations.length === 0) return of([]);

      const scheduleData$ = consultations.map((consultation) =>
        this.authService.getScheduleData(consultation.schedule_id).pipe(
          map((b) => ({
            ...consultation,
            scheduleData: b,
          }))
        )
      );

      return forkJoin(scheduleData$);
    }),
    map((consultations) =>
      consultations.map((consultation) => ({
        ...consultation,
        scheduleData: {
          ...consultation.scheduleData,
          startTime: getTimeFromEpoch(consultation.scheduleData.start_time),
          endTime: getTimeFromEpoch(consultation.scheduleData.end_time),
        },
      }))
    ),
    tap((_) => this.spinner.hide())
  );
}
