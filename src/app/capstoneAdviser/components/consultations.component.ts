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

    <Modal inputId="consultationModal">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex flex-col justify-between">
            <h1 class="text-[24px] text-primary-content">
              Consultation title placeholder
            </h1>

            <div class="text-[12px] text-primary-content/50">
              Created at 5/1/23 by Student Name
            </div>
          </div>
        </div>
        <div
          class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
        >
          <div class="flex w-full flex-col gap-2 bg-base-100 p-6">
            <div>
              <div class="flex items-center justify-between ">
                <h1 class="text-[20px] text-base-content">Description</h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div class="text-base text-base-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem
                ipsum dolor sit
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between ">
                <h1 class="text-[20px] text-base-content">Date and Time</h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div class="text-base text-base-content">
                May 1, 2023 - 10:00 PM
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between ">
                <h1 class="text-[20px] text-base-content">Location</h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div class="text-base text-base-content">comlab 3</div>
            </div>
          </div>
          <ul
            class="flex h-full w-full flex-col  bg-neutral/20 p-0 py-2 sm1:w-[223px]"
          >
            <div class="h-full"></div>
            <button
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px]"
            >
              <i-feather
                class="text-base-content/70"
                name="x-circle"
              ></i-feather>
              close
            </button>
          </ul>
        </div>
      </div>
    </Modal>
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
