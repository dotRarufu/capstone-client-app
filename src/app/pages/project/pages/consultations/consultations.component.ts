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

@Component({
  selector: 'consultations',
  standalone: true,
  imports: [
    AccordionComponent,
    FeatherIconsModule,
    ConsultationCardComponent,
    ScheduleConsultationModalComponent,
    ConsultationDetailsModalComponent,
    CommonModule,
    CompletedConsultationModalComponent,
    ScheduledConsultationModalComponent,
  ],
  template: `
    <ng-container
      *ngIf="{
        consultations: consultations$ | async,
        role: role$ | async
      } as observables"
    >
      <div class="flex h-full flex-col gap-[16px] ">
        <div class="flex justify-between ">
          <h1 class="hidden text-2xl text-base-content min-[998px]:block">
            Consultation
          </h1>

          <button
            *ngIf="observables.role === 's'"
            onclick="scheduleConsultation.showModal()"
            class="btn-ghost btn-sm flex flex-row items-center gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 font-[500] text-base-content hover:border-base-content/30"
          >
            <i-feather class="text-base-content/70" name="plus" />
            <span class="uppercase"> Schedule </span>
          </button>
        </div>

        <div class="h-[2px] w-full bg-base-content/10"></div>

        <accordion
          *ngFor="let c of observables.consultations"
          [heading]="c.category"
        >
          <div class="flex flex-wrap justify-start gap-[24px]">
            <consultation-card
              *ngFor="let data of c.items | async"
              [data]="data"
              (click)="
                this.consultationStateService.setActiveConsultation(data)
              "
              [buttonId]="c.buttonId"
            >
              <!-- todo: add slot for controls -->
            </consultation-card>
          </div>
        </accordion>
      </div>

      <schedule-consultation-modal *ngIf="observables.role === 's'" />
      <consultation-details-modal />
      <!-- todo: find out why id has  to be wrapped -->
      <consultation-details-modal [id]="'pendingConsultationsModal'">
        <button
          *ngIf="observables.role === 's'"
          (click)="cancelInvitation()"
          class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
        >
          <i-feather class="text-base-content/70" name="x" /> cancel
        </button>
      </consultation-details-modal>
      <completed-consultation-modal
        *ngIf="['c', 't', 'ct'].includes(observables.role || '')"
      />
      <scheduled-consultation-modal *ngIf="['t', 'ct'].includes(observables.role || '')" />
      <consultation-details-modal
        *ngIf="['t', 'ct'].includes(observables.role || '')"
        [id]="'techAdPendingConsultationsModal'"
      >
        <button
          (click)="handleInvitation(true)"
          class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
        >
          <i-feather class="text-base-content/70" name="x" /> Accept
        </button>
        <button
          (click)="handleInvitation(false)"
          class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
        >
          <i-feather class="text-base-content/70" name="x" /> Decline
        </button>
      </consultation-details-modal>
    </ng-container>
  `,
})
export class ConsultationsComponent {
  consultationService = inject(ConsultationService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  consultationStateService = inject(ConsultationStateService);
  projectService = inject(ProjectService);
  authService = inject(AuthService);
  destroyRef = inject(DestroyRef);

  projectId = Number(this.route.parent!.snapshot.url[0].path);

  role$ = this.authService.getAuthenticatedUser().pipe(
    filter(isNotNull),
    switchMap((u) => {
      if (u.role_id === 0) return of('s');

      return this.projectService.getAdviserProjectRole(this.projectId, u.uid);
    }),
    tap(v => console.log("role123:", v))
  );
  consultations$ = this.authService.getAuthenticatedUser().pipe(
    filter(isNotNull),
    switchMap((u) => {
      if (u.role_id === 0) return of('s');

      return this.projectService.getAdviserProjectRole(this.projectId, u.uid);
    }),
    map((role) => [
      {
        category: 'Pending',
        items: this.consultationService
          .getConsultations(0, this.projectId)
          .pipe(takeUntilDestroyed(this.destroyRef)),
        buttonId: this.getButtonIdForPendingAccordion(role),
      },
      {
        category: 'Scheduled',
        items: this.consultationService
          .getConsultations(1, this.projectId)
          .pipe(takeUntilDestroyed(this.destroyRef)),
        buttonId: ['t', 'ct'].includes(role) ? 'techAdScheduled' : '',
      },
      {
        category: 'Completed',
        items: this.consultationService
          .getConsultations(2, this.projectId)
          .pipe(takeUntilDestroyed(this.destroyRef)),
        buttonId: ['t', 'ct'].includes(role) ? 'techAdCompleted' : '',
      },
      {
        category: 'Declined',
        items: this.consultationService
          .getConsultations(3, this.projectId)
          .pipe(takeUntilDestroyed(this.destroyRef)),
      },
    ])
  );

  handleInvitation(decision: boolean) {
    const activeConsultation =
      this.consultationStateService.getActiveConsultation()!;

    const id = activeConsultation.id;

    this.consultationService.handleInvitation(id, decision).subscribe({
      next: (res) => {
        this.toastr.success(res);
      },
      error: (err) => {
        this.toastr.error(err);
      },
    });
  }

  cancelInvitation() {
    const consultation = this.consultationStateService.getActiveConsultation()!;

    this.consultationService.cancelInvitation(consultation.id).subscribe({
      next: (res) => this.toastr.success(res),
      error: (res) => this.toastr.error(res),
    });
  }

  getButtonIdForPendingAccordion(role: string) {
    if (['t', 'ct'].includes(role)) return 'techAdPending';
    
    switch (role) {
      case 't':
        return 'techAdPending';
      default:
        return 'studentPending';
    }
  }
}
