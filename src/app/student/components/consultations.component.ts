import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ProjectService } from 'src/app/services/project.service';
import { Consultation } from 'src/app/types/collection';

@Component({
  selector: 'app-student-consultations',
  template: `
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex justify-between ">
        <h1 class="text-[32px] text-base-content">Consultation</h1>
        <label
          for="add-task"
          class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
        >
          <i-feather name="plus"></i-feather>

          Schedule
        </label>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <app-shared-accordion heading="Scheduled">
        <div
          class="flex flex-wrap justify-center gap-[24px] p-[1rem] sm1:justify-start"
        >
          
          <div
            *ngFor="let consultation of scheduled"
            class="card-compact card h-fit w-full max-w-[262px] cursor-pointer rounded-[4px] border border-base-content/50 bg-base-100 shadow-xl"
          >
            <figure class="h-[92px] bg-secondary">
              <h2
                class="card-title  w-full px-4 text-left text-secondary-content"
              >
                Consultation Title
              </h2>
            </figure>
            <div class="card-body">
              <p class="text-sm">Location: {{consultation.location}}</p>
              <p class="text-sm">Time and Date: {{consultation.date_time}}</p>

              <div class="card-actions justify-end">
                <button
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <button
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 9V19H8V9H16ZM14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM18 7H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </app-shared-accordion>
      <app-shared-accordion heading="Scheduled">
        <div
          class="flex flex-wrap justify-center gap-[24px] p-[1rem] sm1:justify-start"
        >
          <!-- *ngFor="let consultation of consultations" -->
          <div
            class="card-compact card h-fit w-full max-w-[262px] cursor-pointer rounded-[4px] border border-base-content/50 bg-base-100 shadow-xl"
          >
            <figure class="h-[92px] bg-secondary">
              <h2
                class="card-title  w-full px-4 text-left text-secondary-content"
              >
                Consultation Title
              </h2>
            </figure>
            <div class="card-body">
              <p class="text-sm">Location: comlab3</p>
              <p class="text-sm">Time and Date: 5/1/23 - 4PM</p>

              <div class="card-actions justify-end">
                <button
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <button
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 9V19H8V9H16ZM14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM18 7H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </app-shared-accordion>
      <app-shared-accordion heading="Scheduled">
        <div
          class="flex flex-wrap justify-center gap-[24px] p-[1rem] sm1:justify-start"
        >
          <!-- *ngFor="let consultation of consultations" -->
          <div
            class="card-compact card h-fit w-full max-w-[262px] cursor-pointer rounded-[4px] border border-base-content/50 bg-base-100 shadow-xl"
          >
            <figure class="h-[92px] bg-secondary">
              <h2
                class="card-title  w-full px-4 text-left text-secondary-content"
              >
                Consultation Title
              </h2>
            </figure>
            <div class="card-body">
              <p class="text-sm">Location: comlab3</p>
              <p class="text-sm">Time and Date: 5/1/23 - 4PM</p>

              <div class="card-actions justify-end">
                <button
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <button
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 9V19H8V9H16ZM14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM18 7H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </app-shared-accordion>
    </div>
  `,
})
// todo: make a one dynamic accordion component under shared module
export class ConsultationsComponent {
  scheduled: Consultation[] = [];
  
  constructor(private consultationService: ConsultationService, private projectService: ProjectService) {}

  ngOnInit() {
    const projectId = this.projectService.activeProjectIdSignal();
    this.consultationService.getConsultations(true, projectId).subscribe(consultations => {this.scheduled = consultations; console.log('consultations:', consultations)})
  }
}
