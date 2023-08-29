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
            *ngFor="let data of c.items"
            [data]="data"
            (click)="handleCardClick(data)"
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

  role = this.route.snapshot.data['role'];
  consultations: {
    category: string;
    items: Consultation[];
    buttonId?: string;
  }[] = [
    {
      category: 'Pending',
      items: [],
      buttonId: this.getButtonIdForPendingAccordion(),
    },
    {
      category: 'Scheduled',
      items: [],
      buttonId: this.role === 't' ? 'techAdScheduled' : '',
    },
    {
      category: 'Completed',
      items: [],
      buttonId: this.role === 't' ? 'techAdCompleted' : '',
    },
    { category: 'Declined', items: [] },
  ];

  handleInvitation(decision: boolean) {
    const activeConsultation =
      this.consultationStateService.getActiveConsultation();

    if (activeConsultation === null)
      throw new Error('should be nmpossible, no consultation is selected');

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
    const consultation = this.consultationStateService.getActiveConsultation();

    if (consultation === null)
      throw new Error('cant cancel invitation without an active one');
    this.consultationService.cancelInvitation(consultation.id).subscribe({
      next: (res) => this.toastr.success(res),
      error: (res) => this.toastr.error(res),
    });
  }

  ngOnInit() {
    const projectId = Number(this.route.parent!.snapshot.url[0].path);
    // todo: refactor these
    const scheduled$ = this.consultationService
      .getConsultations(1, projectId)
      .pipe(takeUntilDestroyed(this.destroyRef));
    const pending$ = this.consultationService
      .getConsultations(0, projectId)
      .pipe(takeUntilDestroyed(this.destroyRef));
    const completed$ = this.consultationService
      .getConsultations(2, projectId)
      .pipe(takeUntilDestroyed(this.destroyRef));
    const rejected$ = this.consultationService
      .getConsultations(3, projectId)
      .pipe(takeUntilDestroyed(this.destroyRef));

    scheduled$.subscribe({
      next: (consultations) => {
        const scheduled = this.consultations[1];
        // maybe make this non mutated
        scheduled.items = consultations;
      },
    });
    pending$.subscribe({
      next: (consultations) => {
        const pending = this.consultations[0];
        // maybe make this non mutated
        pending.items = consultations;
      },
    });
    completed$.subscribe({
      next: (consultations) => {
        const completed = this.consultations[2];
        // maybe make this non mutated
        completed.items = consultations;
      },
    });
    rejected$.subscribe({
      next: (consultations) => {
        const rejected = this.consultations[3];
        // maybe make this non mutated
        rejected.items = consultations;
      },
    });
  }

  handleCardClick(data: Consultation) {
    this.consultationStateService.setActiveConsultation(data);
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
