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
import { ScheduleNotificationDetailsModalComponent } from './schedule-notification-detail-modal.component';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import {
  ProfileStateService,
  SelectedScheduleNotification,
} from './data-access/profile-state.service';
import { isNotNull } from 'src/app/utils/isNotNull';
import { Router } from '@angular/router';
import { getRolePath } from 'src/app/utils/getRolePath';

@Component({
  selector: 'notifications',
  standalone: true,
  imports: [
    CommonModule,
    ScheduleNotificationDetailsModalComponent,
    FeatherIconsModule,
  ],
  template: `
    <div
      *ngIf="{
        notifications: (notifications$ | async) || [],
        schedules: (schedules$ | async) || [],
        forcedSchedules: (forcedSchedules$ | async) || []
      } as observables"
      class="flex flex-col gap-4 py-4"
    >
      <h1 class="font-bold">Notifications</h1>
      <ul
        *ngIf="
          observables.notifications.length > 0 ||
            observables.schedules.length > 0 ||
            observables.forcedSchedules.length > 0;
          else empty
        "
        class="flex w-full flex-col gap-2"
      >
        <li
          *ngFor="let notification of observables.notifications"
          class="flex w-full items-center justify-between rounded-[5px] bg-base-200 px-4 py-2"
        >
          <span class=""
            ><span class="font-bold">{{ notification.senderData.name }}</span>
            invited you to participate in their project as
            {{ notification.roleName }}</span
          >
          <div class="join rounded-[5px] border">
            <button
              (click)="
                acceptInvitation(
                  notification.id,
                  notification.receiver_uid,
                  notification.role,
                  notification.project_id
                )
              "
              class="btn-sm join-item btn hover:btn-success"
            >
              Accept
            </button>
            <button
              (click)="deleteInvitation(notification.id)"
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
          
            (click)="confirmSchedule(schedule.id, schedule.project.id)"
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
          <button class="btn-sm btn" (click)="navigateToProjectConsultation(schedule.project_id)">
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
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  profileStateService = inject(ProfileStateService);
  router = inject(Router);

  notifications$ = this.authService.getNotifications().pipe(
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
  schedules$ = this.authService.getUnavailableSchedules().pipe(
    
    switchMap((schedules) => {
      if (schedules.length === 0) return of([]);

      const nonNull = schedules.filter((s) => s.taken_by_project !== null);
      const uniqueSchedules = getUniqueItems(nonNull, 'taken_by_project');
   
      const uniqueReqs$ = uniqueSchedules.map((s) =>
        this.projectService
          .getProjectInfo(s.taken_by_project!)
          
      );

      return forkJoin(uniqueReqs$).pipe(
        map((projectData) =>
          nonNull.map((s) => {
            const matchedProjectData = projectData.find(
              (p) => p.id === s.taken_by_project
            );

            return { ...s, project: matchedProjectData! };
          })
        ),
         
      );
    }),
  
    map((p) =>
      p
        .map((a) => ({
          ...a,
          formattedStartTime: convertUnixEpochToDateString(a.start_time),
        }))
        .flat(1)
    ),
    
  );
  forcedSchedules$ = this.projectService.getProjects().pipe(
    filter(isNotNull),
    switchMap((projects) => {
      if (projects.length === 0) return of([]);

      return forkJoin(
        projects.map(({ id }) => this.projectService.getProjectInfo(id))
      );
    }),
    map((projects) => projects.map((p) => p.technical_adviser_id)),
    map((ids) => ids.filter((id) => id !== null) as string[]),

    switchMap((technicalAdvisers) =>
      this.authService.getForcedSchedules(technicalAdvisers)
    ),
    switchMap((schedules) => {
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

  confirmSchedule(consultationId: number, projectId: number) {
    this.spinner.show();

    this.authService.confirmScheduleNotification(consultationId).subscribe({
      complete: () => {
        // this.spinner.hide();
        // this.toastr.success('Schedule confirmed');
        this.navigateToProjectConsultation(projectId);
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Failed to confirm schedule');
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

        map((user) => getRolePath(user.role_id)),

      )
      .subscribe({
        next: (rolePath) => {

          this.router.navigate([rolePath, 'p', projectId, 'consultations']);



      },
      });
  }
}
