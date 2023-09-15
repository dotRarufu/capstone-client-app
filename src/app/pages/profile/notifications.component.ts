import { Component, Input, inject } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { forkJoin, map, of, switchMap, tap } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import getRoleName from 'src/app/utils/getRoleName';

@Component({
  selector: 'notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="{ notifications: (notifications$ | async) || [] } as observables"
      class="flex flex-col gap-4 py-4"
    >
      <h1 class="font-bold">Notifications</h1>
      <ul
        *ngIf="observables.notifications.length > 0; else empty"
        class="flex w-full flex-col gap-2"
      >
        <li
          *ngFor="let notification of observables.notifications"
          class="flex w-full items-center justify-between rounded-[5px] bg-base-200 px-4 py-2"
        >
          <span class=""
            ><span class="font-bold">{{ notification.senderData.name }}</span>
            invited you to participate in their project as
            {{ getRoleName(notification.role) }}</span
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
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
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
        })
      );

      return res$;
    })
  );

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

  getRoleName(id: number) {
    return getRoleName(id);
  }
}
