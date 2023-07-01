import { Component } from '@angular/core';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ProjectService } from 'src/app/services/project.service';
import { Consultation } from 'src/app/types/collection';
import { convertUnixEpochToDateString } from '../utils/convertUnixEpochToDateString';

@Component({
  template: `
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex justify-between ">
        <h1 class="text-[32px] text-base-content">Consultation</h1>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <Accordion *ngFor="let consultation of consultations" [heading]="consultation.category">
        <div class="flex flex-wrap justify-center gap-[24px] sm1:justify-start">
          <div
            *ngFor="let item of consultation.items"
            class="card card-compact h-fit w-full max-w-[262px]  rounded-[4px] border border-base-content/50 bg-base-100 shadow-md"
          >
            <figure class="h-[92px] bg-secondary">
              <button
                onclick="consultationModal.showModal()"
                class="link-hover link card-title  w-full px-4 text-left text-secondary-content"
              >
                {{ epochToDateString(item.date_time) }}
              </button>
            </figure>
            <div class="card-body">
              <p class="text-sm">{{ item.location }}</p>
              <p class="text-sm">
                {{ item.description }}
              </p>

              <div class="card-actions justify-end">
                <button
                  onclick="consultationModal.showModal()"
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <i-feather class="text-base-content/70" name="log-in" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Accordion>
    </div>

    <ConsultationModal />
  `,
})
export class ConsultationsComponent {
  consultations: { category: string; items: Consultation[] }[] = [
    { category: 'Pending', items: [] },
    { category: 'Scheduled', items: [] },
    { category: 'Completed', items: [] },
  ];

  constructor(
    private consultationService: ConsultationService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    const projectId = this.projectService.activeProjectId();
    // todo: refactor these
    const scheduled$ = this.consultationService.getConsultations(
      true,
      projectId,
      false
    );
    const pending$ = this.consultationService.getConsultations(
      false,
      projectId,
      false
    );
    const completed$ = this.consultationService.getConsultations(
      true,
      projectId,
      true
    );

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


  }

  epochToDateString(unixEpoch: number) {
    return convertUnixEpochToDateString(unixEpoch);
  }
}
