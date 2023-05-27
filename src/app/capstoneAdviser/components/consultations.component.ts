import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ProjectService } from 'src/app/services/project.service';
import { Consultation } from 'src/app/types/collection';

@Component({
  selector: 'app-capstone-adviser-consultations',
  template: `
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex justify-between ">
        <h1 class="text-[32px] text-base-content">Consultation</h1>
        
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <app-shared-accordion heading="Scheduled">
        <div
          class="flex flex-wrap justify-center gap-[24px] p-[1rem] sm1:justify-start"
        >
          <div
            *ngFor="let consultation of scheduled"
            class="card-compact card h-fit w-full max-w-[262px]  rounded-[4px] border border-base-content/50 bg-base-100 shadow-md"
          >
            <figure class="h-[92px] bg-secondary">
              <label for="consultation-modal"
                class="link link-hover card-title  w-full px-4 text-left text-secondary-content"
              >
                {{ 'Untitled' }}
              </label>
            </figure>
            <div class="card-body">
              <p class="text-sm">Location: {{ consultation.location }}</p>
              <p class="text-sm">
                Time and Date:
                {{ convertUnixEpochToDateString(consultation.date_time) }}
              </p>

              <div class="card-actions justify-end">
                <label for="consultation-modal"
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <i-feather name="log-in"></i-feather>
                </label>
               
              </div>
            </div>
          </div>
        </div>
      </app-shared-accordion>
      <app-shared-accordion heading="Completed">
        <div
          class="flex flex-wrap justify-center gap-[24px] p-[1rem] sm1:justify-start"
        >
          <div
            *ngFor="let consultation of scheduled"
            class="card-compact card h-fit w-full max-w-[262px]  rounded-[4px] border border-base-content/50 bg-base-100 shadow-md"
          >
            <figure class="h-[92px] bg-secondary">
              <label for="consultation-modal"
                class="link link-hover card-title  w-full px-4 text-left text-secondary-content"
              >
                {{ 'Untitled' }}
              </label>
            </figure>
            <div class="card-body">
              <p class="text-sm">Location: {{ consultation.location }}</p>
              <p class="text-sm">
                Time and Date:
                {{ convertUnixEpochToDateString(consultation.date_time) }}
              </p>

              <div class="card-actions justify-end">
                <label for="consultation-modal"
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <i-feather name="log-in"></i-feather>
                </label>
               
              </div>
            </div>
          </div>
        </div>
      </app-shared-accordion>
      <app-shared-accordion heading="Done">
        <div
          class="flex flex-wrap justify-center gap-[24px] p-[1rem] sm1:justify-start"
        >
          <div
            *ngFor="let consultation of scheduled"
            class="card-compact card h-fit w-full max-w-[262px]  rounded-[4px] border border-base-content/50 bg-base-100 shadow-md"
          >
            <figure class="h-[92px] bg-secondary">
              <label for="consultation-modal"
                class="link link-hover card-title  w-full px-4 text-left text-secondary-content"
              >
                {{ 'Untitled' }}
              </label>
            </figure>
            <div class="card-body">
              <p class="text-sm">Location: {{ consultation.location }}</p>
              <p class="text-sm">
                Time and Date:
                {{ convertUnixEpochToDateString(consultation.date_time) }}
              </p>

              <div class="card-actions justify-end">
                <label for="consultation-modal"
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <i-feather name="log-in"></i-feather>
                </label>
               
              </div>
            </div>
          </div>
        </div>
      </app-shared-accordion>
      
    </div>

    <app-modal inputId="consultation-modal">
    <div class="flex flex-col rounded-[3px] border border-base-content/10 w-[712px]">
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex flex-col justify-between">
            <h1 class="text-[24px] text-primary-content">
              Consultation title placeholder
            </h1>

            <div class="text-[12px] text-primary-content/50">
              Created at 5/1/23 by Student Name
            </div>
          </div>
          <label
            for="consultation-modal"
            class="btn-ghost btn-sm btn-circle btn text-primary-content/60"
            ><i-feather name="x"></i-feather
          ></label>
        </div>
        <div class="flex bg-base-100">
          <div class="flex w-full flex-col gap-2 bg-base-100 p-6">
            <div>

            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Description</h1>
      
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <div class="text-base text-base-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem
              ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum
              dolor sit
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

            <div class="text-base text-base-content">
              comlab 3
            </div>

            </div>
                                  
          </div>
          <ul
            class=" flex w-[223px]  flex-col bg-neutral/20 py-2 "
          >
         

            <div class="h-full"></div>
            <li class="btn-ghost btn flex justify-start gap-2 rounded-[3px]">
               <i-feather name="trash"></i-feather> close
          </li>
          </ul>
        </div>
      </div>
    </app-modal>
  `,
})
// todo: make a one dynamic accordion component under shared module
export class ConsultationsComponent {
  scheduled: Consultation[] = [];

  constructor(
    private consultationService: ConsultationService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    const projectId = this.projectService.activeProjectIdSignal();
    const getConsultations$ = this.consultationService.getConsultations(
      true,
      projectId
    );
    getConsultations$.subscribe((consultations) => {
      this.scheduled = consultations;
      console.log('consultations:', consultations);
    });
  }

  convertUnixEpochToDateString(unixEpoch: number) {
    const date = new Date(unixEpoch * 1000);
    const monthName = date.toLocaleString('en-us', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    const res = `${monthName} ${day} ${year}`;

    return res;
  }
}