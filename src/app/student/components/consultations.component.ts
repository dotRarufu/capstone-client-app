import { Component, WritableSignal, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ProjectService } from 'src/app/services/project.service';
import { Consultation } from 'src/app/types/collection';

@Component({
  template: `
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex justify-between ">
        <h1 class="text-[32px] text-base-content">Consultation</h1>
        <button
          onclick="scheduleConsultation.showModal()"
          class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
        >
          <i-feather class="text-base-content/70" name="plus" />

          Schedule
        </button>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <Accordion heading="Pending">
        <div class="flex flex-wrap justify-center gap-[24px] sm1:justify-start">
          <ConsultationCard
            *ngFor="let data of consultations[0].items"
            [data]="data"
            (click)="handleCardClick(data)"
            buttonId="studentPending"
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

    <ScheduleConsultationModal
      [dateTime]="dateTime"
      [description]="description"
      [location]="location"
    />

    <ConsultationDetailsModal [consultation$]="activeConsultation$" />

    <!-- todo: find out why id has  to be wrapped -->
    <ConsultationDetailsModal
      [consultation$]="activeConsultation$"
      [id]="'pendingConsultationsModal'"
    >
      <button
        (click)="cancelInvitation()"
        class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
      >
        <i-feather class="text-base-content/70" name="x" /> cancel
      </button>
    </ConsultationDetailsModal>
  `,
})
export class ConsultationsComponent {
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

  constructor(
    private consultationService: ConsultationService,
    private projectService: ProjectService,
    private toastr: ToastrService
  ) {}

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

  handleCardClick(data: Consultation) {
    this.activeConsultationSubject.next(data);
  }
}
