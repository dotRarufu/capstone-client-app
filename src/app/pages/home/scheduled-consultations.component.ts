import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import {
  BehaviorSubject,
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
import {
  ActiveConsultation,
  HomeStateService,
} from './data-access/home-state.service';
import { ProjectService } from 'src/app/services/project.service';
import { ConsultationDetailsModalComponent } from '../project/pages/consultations/consultation-details-modal.component';
import { ScheduledConsultationDetailsModalComponent } from './scheduled-consultation-details-modal.component';
import combineDateAndTime from 'src/app/utils/combineDateAndTime';
import separateDateAndTime from 'src/app/utils/separateDateAndTime';
import { dateToDateString } from 'src/app/utils/dateToDateString';
import epochTo24hour from 'src/app/utils/epochTo24hour';
import toScheduleDateField from 'src/app/utils/toScheduleDateField';
import getUniqueItems from 'src/app/utils/getUniqueItems';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import sortArrayByProperty from 'src/app/utils/sortArrayByProperty';

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
      *ngIf="{ consultations: (consultations$ | async) || [] } as observables"
    >
      <div class="flex flex-col gap-1">
        <div class="flex justify-between">
          <h2 class="text-2xl">Scheduled Consultations</h2>
          <button
            *ngIf="observables.consultations.length > 1"
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

        <div class="h-[2px] w-full bg-base-content/10"></div>
      </div>

      <ul class="flex flex-col gap-2 rounded-[5px]">
        <li
          onclick="consultationModal.showModal()"
          *ngFor="let consultation of observables.consultations"
          (click)="homeStateService.setActiveConsultation(consultation)"
          class=" grid w-full cursor-pointer grid-cols-2 gap-2 rounded-[5px] bg-base-200 px-4 py-2  hover:bg-base-300 sm1:grid-cols-4 sm1:justify-between"
        >
          <div
            class="p-0 text-base text-base-content sm1:grid sm1:w-fit   sm1:place-content-center sm1:text-left sm1:text-[18px]"
          >
            {{ consultation.dateString }}
          </div>
          <div
            class="text-right text-base text-base-content/70 sm1:grid sm1:place-content-center sm1:text-center"
          >
            {{ consultation.location }}
          </div>

          <div
            class="p-0 text-left text-base text-base-content sm1:grid  sm1:place-content-center sm1:text-center sm1:text-[18px]"
          >
            {{ consultation.description }}
          </div>
          <span
            class="flex items-center justify-end text-right text-base text-base-content/70"
            >{{ consultation.project.name }}</span
          >
        </li>
      </ul>

      <div
        class="flex w-full items-center justify-center rounded-[5px] bg-base-200 p-4 text-base-content/70"
        *ngIf="observables.consultations.length === 0"
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
  destroyRef = inject(DestroyRef);

  rawConsultations$ = this.authService.getAuthenticatedUser().pipe(
    takeUntilDestroyed(this.destroyRef),
    filter(isNotNull),
    switchMap((user) =>
      this.projectService.getProjects().pipe(
        filter(isNotNull),
        switchMap((projects) =>
          forkJoin(
            projects.map(({ id }) =>
              this.projectService
                .getAdviserProjectRole(id, user.uid)
                .pipe(map((role) => ({ role, projectId: id })))
            )
          ).pipe(
            map((projectsAndRoles) =>
              projectsAndRoles.filter(({ role }) => role === 't')
            )
          )
        )
      )
    ),
    tap(() => this.spinner.show()),
    map((projects) => {
      if (projects.length === 0) throw new Error('User has no projects');

      return projects;
    }),
    map((projects) => projects.map(({ projectId }) => projectId)),

    switchMap((projectIds) => {
      const projectsConsultations = projectIds.map((id) =>
        this.consultationService.getConsultations(1, id).pipe(take(1))
      );

      return forkJoin(projectsConsultations);
    }),
    map((consultations) => consultations.flat())
  );
  sortSubject = new BehaviorSubject<'asc' | 'desc'>('asc');

  consultations$ = this.authService.getAuthenticatedUser().pipe(
    filter(isNotNull),
    switchMap(() => this.consultationService.newConsultation$),

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

    switchMap((consultations) =>
      this.sortSubject.asObservable().pipe(
        map((order) => {
          return { order, consultations };
        }),
        map(({ consultations, order }) =>
          sortArrayByProperty(consultations, 'date_time', order)
        )
      )
    ),
    switchMap((consultations) => {
      const uniqueUsers = getUniqueItems(consultations, 'organizer_id');
      const usersData$ = forkJoin(
        uniqueUsers.map((u) => this.authService.getUserData(u.organizer_id))
      ).pipe(
        map((data) =>
          consultations.map((c) => {
            const match = data.find((d) => d.uid === c.organizer_id)!;

            return { ...c, organizer: match };
          })
        ),
        tap(() => this.spinner.hide())
      );

      return usersData$;
    })
  );

  invertSortOrder() {
    const old = this.sortSubject.getValue();
    this.sortSubject.next(old === 'asc' ? 'desc' : 'asc');
  }

  getInvertedSort() {
    return this.sortSubject.getValue() === 'asc' ? 'arrow-down' : 'arrow-up';
  }
}
