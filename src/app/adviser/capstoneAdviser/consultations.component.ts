import { Component } from '@angular/core';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ProjectService } from 'src/app/services/project.service';
import { Consultation } from 'src/app/types/collection';
import { convertUnixEpochToDateString } from '../../student/utils/convertUnixEpochToDateString';
import { BehaviorSubject } from 'rxjs';
import { AccordionComponent } from 'src/app/components/accordion/accordion.component';
import { CommonModule } from '@angular/common';
import { ConsultationCardComponent } from 'src/app/components/card/consultation.component';
import { ConsultationDetailsModalComponent } from 'src/app/components/modal/consultation.component';
import { CompletedConsultationModalComponent } from '../components/completedConsultationModal.component';

@Component({
  standalone: true,
  imports: [AccordionComponent, CommonModule, ConsultationCardComponent, ConsultationDetailsModalComponent, CompletedConsultationModalComponent],
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
            buttonId="techAdCompleted"
          >
            <!-- todo: add slot for controls -->
          </ConsultationCard>
        </div>
      </Accordion>
    </div>

    <ConsultationDetailsModal [consultation$]="activeConsultation$" />

    <CompletedConsultationModal [consultation$]="activeConsultation$" />
  `,
})
export class CapstoneAdviserConsultationsComponent {
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
    private projectService: ProjectService
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

  epochToDateString(unixEpoch: number) {
    return convertUnixEpochToDateString(unixEpoch);
  }

  handleCardClick(data: Consultation) {
    this.activeConsultationSubject.next(data);
  }
}
