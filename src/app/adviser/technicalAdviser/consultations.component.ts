import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { AccordionComponent } from 'src/app/components/accordion/accordion.component';
import { ConsultationCardComponent } from 'src/app/components/card/consultation.component';
import { ConsultationDetailsModalComponent } from 'src/app/components/modal/consultation.component';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ProjectService } from 'src/app/services/project.service';
import { convertUnixEpochToDateString } from 'src/app/student/utils/convertUnixEpochToDateString';
import { Consultation } from 'src/app/types/collection';
import { ScheduledConsultationModalComponent } from './scheduledModal.component';
import { CompletedConsultationModalComponent } from '../components/completedConsultationModal.component';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';

@Component({
  standalone: true,
  imports: [CommonModule, AccordionComponent, ConsultationCardComponent, ConsultationDetailsModalComponent, ScheduledConsultationModalComponent, CompletedConsultationModalComponent, FeatherIconsModule],
  template: `
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex justify-between ">
        <h1 class="text-[32px] text-base-content">Consultation</h1>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <Accordion heading="Pending">
        <div class="flex flex-wrap justify-center gap-[24px] sm1:justify-start">
          <ConsultationCard
            *ngFor="let data of consultations[0].items"
            [data]="data"
            (click)="handleCardClick(data)"
            buttonId="techAdPending"
          >
            <!-- todo: add slot for controls -->
          </ConsultationCard>
        </div>
      </Accordion>
      <Accordion heading="Scheduled">
        <div class="flex flex-wrap justify-center gap-[24px] sm1:justify-start">
          <ConsultationCard
            *ngFor="let data of consultations[1].items"
            [data]="data"
            (click)="handleCardClick(data)"
            buttonId="techAdScheduled"
          >
            <!-- todo: add slot for controls -->
          </ConsultationCard>
        </div>
      </Accordion>
      <Accordion heading="Completed">
        <div class="flex flex-wrap justify-center gap-[24px] sm1:justify-start">
          <ConsultationCard
            *ngFor="let data of consultations[2].items"
            [data]="data"
            (click)="handleCardClick(data)"
            buttonId="techAdCompleted"
          >
            <!-- todo: add slot for controls -->
          </ConsultationCard>
        </div>
      </Accordion>
      <Accordion heading="Declined">
        <div class="flex flex-wrap justify-center gap-[24px] sm1:justify-start">
          <ConsultationCard
            *ngFor="let data of consultations[3].items"
            [data]="data"
            (click)="handleCardClick(data)"
          >
            <!-- todo: add slot for controls -->
          </ConsultationCard>
        </div>
      </Accordion>
    </div>

    <ConsultationDetailsModal [consultation$]="activeConsultation$" />

    <ScheduledConsultationModal [consultation$]="activeConsultation$" />

    <CompletedConsultationModal [consultation$]="activeConsultation$" />

    <ConsultationDetailsModal
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
    </ConsultationDetailsModal>
  `,
})
export class TechnicalAdviserConsultationsComponent {
  consultations: { category: string; items: Consultation[] }[] = [
    { category: 'Pending', items: [] },
    { category: 'Scheduled', items: [] },
    { category: 'Completed', items: [] },
    { category: 'Declined', items: [] },
  ];
  activeConsultationSubject = new BehaviorSubject<Consultation | null>(null);
  activeConsultation$ = this.activeConsultationSubject.asObservable();

  constructor(
    private consultationService: ConsultationService,
    private projectService: ProjectService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const projectId = this.projectService.activeProjectId();
    // todo: refactor these
    const scheduled$ = this.consultationService.getConsultations(projectId, 1);
    const pending$ = this.consultationService.getConsultations(projectId, 0);
    const completed$ = this.consultationService.getConsultations(projectId, 2);
    const rejected$ = this.consultationService.getConsultations(projectId, 3);

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

  epochToDateString(unixEpoch: number) {
    return convertUnixEpochToDateString(unixEpoch);
  }

  handleCardClick(data: Consultation) {
    this.activeConsultationSubject.next(data);
  }
}
