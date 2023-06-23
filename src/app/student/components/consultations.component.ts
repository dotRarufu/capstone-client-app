import { Component } from '@angular/core';
import { convertUnixEpochToDateString } from 'src/app/capstoneAdviser/utils/convertUnixEpochToDateString';
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

      <Accordion *ngFor="let category of categories" [heading]="category">
        <div class="flex flex-wrap justify-center gap-[24px] sm1:justify-start">
          <div
            *ngFor="let consultation of scheduled"
            class="card-compact card h-fit w-full max-w-[262px]  rounded-[4px] border border-base-content/50 bg-base-100 shadow-md"
          >
            <figure class="h-[92px] bg-secondary">
              <button
                onclick="consultationModal.showModal()"
                class="link-hover link card-title  w-full px-4 text-left text-secondary-content"
              >
                {{ 'Untitled' }}
              </button>
            </figure>
            <div class="card-body">
              <p class="text-sm">Location: {{ consultation.location }}</p>
              <p class="text-sm">
                Time and Date:
                {{ epochToDateString(consultation.date_time) }}
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

    <Modal inputId="scheduleConsultation">
      <div
        class="flex w-[712px] flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between">
            <input
              type="text"
              placeholder="Consultation Title"
              class="input w-full rounded-[3px] border-y-0 border-l-[3px] border-r-0 border-l-primary-content/50 bg-primary px-3 py-2 text-[20px] text-primary-content placeholder:text-[20px] placeholder:text-primary-content placeholder:opacity-70 focus:border-l-[3px] focus:border-l-secondary focus:outline-0 "
            />
          </div>
        </div>
        <div class="flex bg-base-100">
          <div class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4">
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Description</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <textarea
              class="textarea h-[117px] w-full rounded-[3px] border-y-0 border-l-[3px] border-r-0 border-l-base-content/50 text-base leading-normal placeholder:text-base-content placeholder:opacity-70 focus:border-l-[3px] focus:border-l-secondary focus:outline-0"
              placeholder="Description"
            ></textarea>

            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Date and Time</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <input
              type="datetime-local"
              placeholder="Consultation Title"
              class="input w-full rounded-[3px] border-y-0 border-l-[3px] border-r-0 border-l-base-content/50 bg-base-100 px-3 py-2 text-[20px] text-base text-base-content/70 placeholder:text-[20px] placeholder:text-base-content/70 placeholder:opacity-70 focus:border-l-[3px] focus:border-l-secondary focus:outline-0 "
            />

            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Description</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <input
              type="text"
              placeholder="comlab 3"
              class="bg-base input w-full rounded-[3px] border-y-0 border-l-[3px] border-r-0 border-l-base-content/50 px-3 py-2 text-base
text-base-content placeholder:text-base placeholder:text-base-content placeholder:opacity-70 focus:border-l-[3px] focus:border-l-secondary focus:outline-0 "
            />
          </div>
          <ul class=" flex w-[223px]  flex-col bg-neutral/20 p-0 py-2">
            <button
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="calendar" />
              schedule
            </button>

            <div class="h-full"></div>

            <button
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="x" /> cancel
            </button>
          </ul>
        </div>
      </div>
    </Modal>

    <Modal inputId="consultationModal">
      <div
        class="flex w-[712px] flex-col rounded-[3px] border border-base-content/10"
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
        <div class="flex bg-base-100">
          <div class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4">
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
          <ul class=" flex w-[223px]  flex-col bg-neutral/20 py-2 ">
            <div class="h-full"></div>

            <button
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px]"
            >
              <i-feather class="text-base-content/70" name="x-circle" /> close
            </button>
          </ul>
        </div>
      </div>
    </Modal>
  `,
})
// todo: make a one dynamic accordion component under shared module
export class ConsultationsComponent {
  categories = ['Scheduled', 'Completed', 'Done'];
  scheduled: Consultation[] = [];

  constructor(
    private consultationService: ConsultationService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    const projectId = this.projectService.activeProjectId();
    const getConsultations$ = this.consultationService.getConsultations(
      true,
      projectId
    );
    getConsultations$.subscribe((consultations) => {
      this.scheduled = consultations;
      console.log('consultations:', consultations);
    });
  }

  epochToDateString(unixEpoch: number) {
    return convertUnixEpochToDateString(unixEpoch);
  }
}
