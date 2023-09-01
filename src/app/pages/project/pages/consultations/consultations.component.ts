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
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex justify-between ">
        <h1 class="hidden text-2xl text-base-content min-[998px]:block">
          Consultation
        </h1>

        <button
          *ngIf="role === 's'"
          onclick="scheduleConsultation.showModal()"
          class="btn-ghost btn-sm flex flex-row items-center gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 font-[500] text-base-content hover:border-base-content/30"
        >
          <i-feather class="text-base-content/70" name="plus" />
          <span class="uppercase"> Schedule </span>
        </button>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <accordion *ngFor="let c of consultations" [heading]="c.category">
        <div class="flex flex-wrap justify-start gap-[24px]">
          <consultation-card
            *ngFor="let data of c.items | async"
            [data]="data"
            (click)="this.consultationStateService.setActiveConsultation(data)"
            [buttonId]="c.buttonId"
          >
            <!-- todo: add slot for controls -->
          </consultation-card>
        </div>
      </accordion>
    </div>

    <schedule-consultation-modal *ngIf="role === 's'" />
    <consultation-details-modal />
    <!-- todo: find out why id has  to be wrapped -->
    <consultation-details-modal [id]="'pendingConsultationsModal'">
      <button
        *ngIf="role === 's'"
        (click)="cancelInvitation()"
        class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
      >
        <i-feather class="text-base-content/70" name="x" /> cancel
      </button>
    </consultation-details-modal>
    <completed-consultation-modal *ngIf="['c', 't'].includes(role)" />
    <scheduled-consultation-modal *ngIf="role === 't'" />
    <consultation-details-modal
      *ngIf="role === 't'"
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
  `,
})
export class ConsultationsComponent {
  consultationService = inject(ConsultationService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  consultationStateService = inject(ConsultationStateService);
  destroyRef = inject(DestroyRef);

  projectId = Number(this.route.parent!.snapshot.url[0].path);

  role = this.route.snapshot.data['role'];
  consultations = [
    {
      category: 'Pending',
      items: this.consultationService
        .getConsultations(0, this.projectId)
        .pipe(takeUntilDestroyed(this.destroyRef)),
      buttonId: this.getButtonIdForPendingAccordion(),
    },
    {
      category: 'Scheduled',
      items: this.consultationService
        .getConsultations(1, this.projectId)
        .pipe(takeUntilDestroyed(this.destroyRef)),
      buttonId: this.role === 't' ? 'techAdScheduled' : '',
    },
    {
      category: 'Completed',
      items: this.consultationService
        .getConsultations(2, this.projectId)
        .pipe(takeUntilDestroyed(this.destroyRef)),
      buttonId: this.role === 't' ? 'techAdCompleted' : '',
    },
    {
      category: 'Declined',
      items: this.consultationService
        .getConsultations(3, this.projectId)
        .pipe(takeUntilDestroyed(this.destroyRef)),
    },
  ];

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



  getButtonIdForPendingAccordion() {
    switch (this.role) {
      case 's':
        return 'studentPending';
      case 't':
        return 'techAdPending';
      default:
        return '';
    }
  }
}
