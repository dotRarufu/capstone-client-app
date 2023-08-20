import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { AccordionComponent } from 'src/app/components/ui/accordion.component';
import { ConsultationCardComponent } from 'src/app/pages/project/pages/consultations/card.component';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';
import { ConsultationService } from 'src/app/services/consultation.service';
import { Consultation } from 'src/app/types/collection';
import { ConsultationDetailsModalComponent } from 'src/app/pages/project/pages/consultations/consultation-details-modal.component';
import { CommonModule } from '@angular/common';
import { ScheduleConsultationModalComponent } from './schedule-consultation-modal.component';
import { CompletedConsultationModalComponent } from './completed-consultationModal.component';
import { ActivatedRoute } from '@angular/router';
import { ScheduledConsultationModalComponent } from './scheduled-consultation-modal.component';

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

      <accordion heading="Pending">
        <div class="flex flex-wrap justify-start gap-[24px]">
          <consultation-card
            *ngFor="let data of consultations[0].items"
            [data]="data"
            (click)="handleCardClick(data)"
            [buttonId]="getButtonIdForPendingAccordion()"
          >
            <!-- todo: add slot for controls -->
          </consultation-card>
        </div>
      </accordion>
      <accordion heading="Scheduled">
        <div class="flex flex-wrap justify-start gap-[24px]">
          <consultation-card
            *ngFor="let data of consultations[1].items"
            [data]="data"
            (click)="handleCardClick(data)"
            [buttonId]="role === 't' ? 'techAdScheduled' : ''"
          >
            <!-- todo: add slot for controls -->
          </consultation-card>
        </div>
      </accordion>
      <accordion heading="Completed">
        <div class="flex flex-wrap justify-start gap-[24px]">
          <consultation-card
            *ngFor="let data of consultations[2].items"
            [data]="data"
            (click)="handleCardClick(data)"
            [buttonId]="role === 't' ? 'techAdCompleted' : ''"
          >
            <!-- todo: add slot for controls -->
          </consultation-card>
        </div>
      </accordion>
      <accordion heading="Declined">
        <div class="flex flex-wrap justify-start gap-[24px] ">
          <consultation-card
            *ngFor="let data of consultations[3].items"
            [data]="data"
            (click)="handleCardClick(data)"
          >
            <!-- todo: add slot for controls -->
          </consultation-card>
        </div>
      </accordion>
    </div>

    <schedule-consultation-modal
      *ngIf="role === 's'"
      [dateTime]="dateTime"
      [description]="description"
      [location]="location"
    />

    <consultation-details-modal [consultation$]="activeConsultation$" />

    <!-- todo: find out why id has  to be wrapped -->
    <consultation-details-modal
      [consultation$]="activeConsultation$"
      [id]="'pendingConsultationsModal'"
    >
      <button
        *ngIf="role === 's'"
        (click)="cancelInvitation()"
        class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
      >
        <i-feather class="text-base-content/70" name="x" /> cancel
      </button>
    </consultation-details-modal>

    <completed-consultation-modal
      *ngIf="['c', 't'].includes(role)"
      [consultation$]="activeConsultation$"
    />

    <scheduled-consultation-modal
      *ngIf="role === 't'"
      [consultation$]="activeConsultation$"
    />

    <consultation-details-modal
      *ngIf="role === 't'"
      [id]="'techAdPendingConsultationsModal'"
      [consultation$]="activeConsultation$"
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
  consultationService = inject(ConsultationService)
  toastr = inject(ToastrService)
  route = inject(ActivatedRoute)

  consultations: { category: string; items: Consultation[] }[] = [
    { category: 'Pending', items: [] },
    { category: 'Scheduled', items: [] },
    { category: 'Completed', items: [] },
    { category: 'Declined', items: [] },
  ];
  dateTime = '';
  description = '';
  location = '';
  activeConsultationSubject = new BehaviorSubject<Consultation | null>(null);
  activeConsultation$ = this.activeConsultationSubject.asObservable();
  role = this.route.snapshot.data['role'];


 
  handleInvitation(decision: boolean) {
    const activeConsultation = this.activeConsultationSubject.getValue();

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
    const consultation = this.activeConsultationSubject.getValue();
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
    const scheduled$ = this.consultationService.getConsultations(1, projectId);
    const pending$ = this.consultationService.getConsultations(0, projectId);
    const completed$ = this.consultationService.getConsultations(2, projectId);
    const rejected$ = this.consultationService.getConsultations(3, projectId);

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
    this.activeConsultationSubject.next(data);
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
