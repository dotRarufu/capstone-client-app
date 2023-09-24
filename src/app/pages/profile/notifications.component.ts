import { Component, Input, inject } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { filter, forkJoin, map, of, switchMap, take, tap } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import getRoleName from 'src/app/utils/getRoleName';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';
import getUniqueItems from 'src/app/utils/getUniqueItems';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import {
  ProfileStateService,
  SelectedScheduleNotification,
} from './data-access/profile-state.service';
import { isNotNull } from 'src/app/utils/isNotNull';
import { Router } from '@angular/router';
import { getRolePath } from 'src/app/utils/getRolePath';
import { ConsultationService } from 'src/app/services/consultation.service';

@Component({
  selector: 'notifications',
  standalone: true,
  imports: [CommonModule, FeatherIconsModule],
  template: `
    <div
      *ngIf="{
        projectInvitations: (projectInvitations$ | async) || [],
        schedules: (schedules$ | async) || [],
        forcedSchedules: (forcedSchedules$ | async) || [],

      } as observables"
      class="flex flex-col gap-4 py-4"
    >
      <h1 class="font-bold">Notifications</h1>
      <ul
        *ngIf="
          observables.projectInvitations.length > 0 ||
            observables.schedules.length > 0 ||
            observables.forcedSchedules.length > 0;
          else empty
        "
        class="flex w-full flex-col gap-2"
      >
        <li
          *ngFor="let projectInvitation of observables.projectInvitations"
          class="flex w-full items-center justify-between rounded-[5px] bg-base-200 px-4 py-2"
        >
          <span class=""
            ><span class="font-bold">{{
              projectInvitation.senderData.name
            }}</span>
            invited you to participate in their project as
            {{ projectInvitation.roleName }}</span
          >
          <div class="join rounded-[5px] border">
            <button
              (click)="
                confirmNotification(projectInvitation.notification.id);
                acceptInvitation(
                  projectInvitation.id,
                  projectInvitation.receiver_uid,
                  projectInvitation.role,
                  projectInvitation.project_id
                )
              "
              class="btn-sm join-item btn hover:btn-success"
            >
              Accept
            </button>
            <button
              (click)="
                confirmNotification(projectInvitation.notification.id);
                deleteInvitation(projectInvitation.id)
              "
              class="btn-sm join-item btn hover:btn-error"
            >
              Delete
            </button>
          </div>
        </li>
        <li
          *ngFor="let schedule of observables.schedules"
          class="flex w-full items-center justify-between rounded-[5px] bg-base-200 px-4 py-2"
        >
          <span class=""
            ><span class="font-bold">{{ schedule.project.name }}</span> has
            arranged a consultation on {{ schedule.formattedStartTime }}
          </span>
          <button
            class="btn-sm btn"
            (click)="
              confirmNotification(schedule.notification.id);
              navigateToProjectConsultation(schedule.project.id)
            "
          >
            <i-feather
              name="log-in"
              class="h-[20px] w-[20px] text-base-content/70"
            />
          </button>
        </li>
        <li
          *ngFor="let schedule of observables.forcedSchedules"
          class="flex w-full items-center justify-between rounded-[5px] bg-base-200 px-4 py-2"
        >
          <span class=""
            ><span class="font-bold">{{ schedule.organizer.name }}</span>
            scheduled a consultation for your project
          </span>
          <button
            class="btn-sm btn"
            (click)="
              confirmNotification(schedule.notification.id);
              navigateToProjectConsultation(schedule.project_id)
            "
          >
            <i-feather
              name="log-in"
              class="h-[20px] w-[20px] text-base-content/70"
            />
          </button>
        </li>
      </ul>

      <ng-template #empty>
        <div
          class="flex w-full items-center justify-center rounded-[5px] bg-base-200 p-4 text-base-content/70"
        >
          You are up to date
        </div>
      </ng-template>
    </div>
  `,
})
export class NotificationsComponent {
  authService = inject(AuthService);
  projectService = inject(ProjectService);
  consultationService = inject(ConsultationService);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  profileStateService = inject(ProfileStateService);
  router = inject(Router);

  notifications$ = this.authService.getNotifications();

  // for advisers
  projectInvitations$ = this.notifications$.pipe(
    map((notifications) => {
      const res = notifications.filter((n) => n.type_id === 2);

      if (notifications.length === 0) return [];

      return res;
    }),

    switchMap((notifications) => {
      if (notifications.length === 0) return of([]);

      return forkJoin(
        notifications.map((n) =>
          this.authService.getProjectInvitation(n.data_id).pipe(
            map((projectInvitation) => ({
              notification: n,
              ...projectInvitation,
            }))
          )
        )
      );
    }),

    switchMap((notifications) => {
      if (notifications.length === 0) return of([]);

      const uniqueSenders = new Set<string>();
      notifications.forEach((n) => uniqueSenders.add(n.sender_uid));

      const sendersData$ = forkJoin(
        [...uniqueSenders].map((uid) => this.authService.getUserData(uid))
      );

      const res$ = sendersData$.pipe(
        map((senders) => {
          const transformed = senders
            .map((sender) => {
              const matched = notifications.filter(
                (n) => n.sender_uid === sender.uid
              );
              return matched.map((m) => ({ ...m, senderData: sender }));
            })
            .flat(1);

          return transformed;
        }),
        map((p) => p.map((s) => ({ ...s, roleName: getRoleName(s.role) })))
      );

      return res$;
    })
  );
  // for technical advisers
  schedules$ = this.notifications$.pipe(
    map((notifications) => {
      const res = notifications.filter((n) => n.type_id === 1);

      if (notifications.length === 0) return [];

      return res;
    }),
    switchMap((notifications) => {
      if (notifications.length === 0) return of([]);

      return forkJoin(
        notifications.map((notification) =>
          this.authService
            .getScheduleData(notification.data_id)
            .pipe(map((schedule) => ({ notification, ...schedule })))
        )
      );
    }),
    switchMap((schedules) => {
      if (schedules.length === 0) return of([]);

      const nonNull = schedules.filter((s) => s.taken_by_project !== null);
      const uniqueSchedules = getUniqueItems(nonNull, 'taken_by_project');

      const uniqueReqs$ = uniqueSchedules.map((s) =>
        this.projectService.getProjectInfo(s.taken_by_project!)
      );

      return forkJoin(uniqueReqs$).pipe(
        map((projectData) =>
          nonNull.map((s) => {
            const matchedProjectData = projectData.find(
              (p) => p.id === s.taken_by_project
            );

            return { ...s, project: matchedProjectData! };
          })
        )
      );
    }),

    map((p) =>
      p
        .map((a) => ({
          ...a,
          formattedStartTime: convertUnixEpochToDateString(a.start_time),
        }))
        .flat(1)
    )
  );
  // for student
  forcedSchedules$ = this.notifications$.pipe(
    map((notifications) => {
      const res = notifications.filter((n) => n.type_id === 0);

      if (notifications.length === 0) return [];

      return res;
    }),
    switchMap((forcedSchedules) => {
      if (forcedSchedules.length === 0) return of([]);

      return forkJoin(
        forcedSchedules.map((schedule) =>
          this.consultationService
            .getConsultationDataById(schedule.data_id)
            .pipe(
              map((consultation) => ({
                notification: schedule,
                ...consultation,
              }))
            )
        )
      );
    }),
    switchMap((schedules) => {
      if (schedules.length === 0) return of([]);

      const technicalAdvisers = getUniqueItems(schedules, 'organizer_id').map(
        (s) => s.organizer_id
      );

      const reqs = technicalAdvisers.map((id) =>
        this.authService.getUserData(id)
      );

      return forkJoin(reqs).pipe(
        map((users) =>
          schedules.map((s) => ({
            ...s,
            organizer: users.find((u) => u.uid === s.organizer_id)!,
          }))
        )
      );
    })
  );

  confirmNotification(id: number) {
    this.spinner.show();
    // todo: update notifications on confirm
    this.authService.confirmNotification(id).subscribe({
      complete: () => {
        this.spinner.hide();
        this.toastr.success('Notification confirmed');
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Failed to confirm notification');
      },
    });
  }

  acceptInvitation(
    id: number,
    userUid: string,
    roleId: number,
    projectId: number
  ) {
    this.spinner.show();

    this.authService
      .acceptInvitation(id, userUid, roleId, projectId)
      .subscribe({
        complete: () => {
          this.spinner.hide();
          this.toastr.success('Invitation accepted');
        },
        error: () => {
          this.spinner.hide();
          this.toastr.error('Failed to accept invitation');
        },
      });
  }

  deleteInvitation(id: number) {
    this.spinner.show();

    this.authService.deleteInvitation(id).subscribe({
      complete: () => {
        this.spinner.hide();
        this.toastr.success('Invitation deleted');
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Failed to delete invitation');
      },
    });
  }

  setSelectedScheduleNotification(d: SelectedScheduleNotification) {
    this.profileStateService.setSelectedScheduleNotification(d);
  }

  navigateToProjectConsultation(projectId: number) {
    const user$ = this.authService.getAuthenticatedUser();
    user$
      .pipe(
        filter(isNotNull),

        map((user) => getRolePath(user.role_id))
      )
      .subscribe({
        next: (rolePath) => {
          this.router.navigate([rolePath, 'p', projectId, 'consultations']);
        },
      });
  }
}
