import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewChildren,
  inject,
  signal,
} from '@angular/core';
import { EMPTY, Observable, filter, map, of, switchMap, tap, take } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';
import { ProjectService } from 'src/app/services/project.service';
import { AuthService } from 'src/app/services/auth.service';
import { Consultation, Task } from 'src/app/types/collection';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { AccomplishmentsComponent } from './accomplishments.component';
import { ConsultationStateService } from './data-access/consultations-state.service';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { isNotNull } from 'src/app/utils/isNotNull';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';
import { CommonModule } from '@angular/common';
import { ModalDialog } from 'src/app/pages/home/scheduled-consultation-details-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsultationService } from 'src/app/services/consultation.service';
import dateToEpoch from 'src/app/utils/dateToEpoch';
import { dateStringToEpoch } from 'src/app/utils/dateStringToEpoch';
import { ToastrService } from 'ngx-toastr';
import hour24ToEpoch from 'src/app/utils/24hourToEpoch';
import combineDateAndTime from 'src/app/utils/combineDateAndTime';

@Component({
  selector: 'forced-schedule-modal',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    FeatherIconsModule,
    AccomplishmentsComponent,
    ReactiveFormsModule,
  ],
  template: `
    <modal [inputId]="'forcedScheduleConsultation'">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
        *ngIf="{
          projects: projects$ | async
        } as observables"
      >
        <div class="flex h-full items-center bg-primary p-[24px]">
          <div class="form-control ">
            <div
              class="input-group rounded-[3px] border border-base-content/50"
            >
              <select
                [formControl]="projectId"
                class="select-bordered select w-full rounded-[3px] border-none text-base  font-normal text-base-content focus:rounded-[3px] "
              >
                <option disabled [ngValue]="-1">Select a project</option>

                <option
                  *ngFor="let project of observables.projects"
                  [ngValue]="project.id"
                >
                  {{ project.id }} | {{ project.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
        >
          <div
            class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4 sm1:overflow-y-auto"
          >
            <div class="flex items-center justify-between ">
              <input
                [formControl]="date"
                type="date"
                class="input w-full rounded-[3px] border-[1px] bg-transparent px-3 py-2 text-[20px] text-base text-base-content/70 placeholder:text-[20px] placeholder:text-base-content/70 placeholder:opacity-70 focus:border-secondary focus:outline-0 "
              />
            </div>

            <div class="flex items-center justify-between gap-2">
              <span class="text-base-content"> FROM </span>
              <input
                type="time"
                [formControl]="startDate"
                placeholder="Start"
                class="bg-base input w-full rounded-[3px] px-3 py-2 text-base text-base-content placeholder:text-base placeholder:text-base-content placeholder:opacity-70 focus:border-secondary focus:outline-0 "
              />
              <span class="text-base-content"> TO </span>
              <input
                type="time"
                [formControl]="endDate"
                placeholder="End"
                class="bg-base input w-full rounded-[3px] px-3 py-2 text-base text-base-content placeholder:text-base placeholder:text-base-content placeholder:opacity-70 focus:border-secondary focus:outline-0 "
              />
            </div>

            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Description</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <textarea
              class="textarea h-[117px] w-full shrink-0 rounded-[3px] border-[1px] text-base leading-normal text-base-content placeholder:text-base-content placeholder:opacity-70 focus:border-secondary focus:outline-0"
              placeholder="Description"
              [formControl]="description"
            ></textarea>

            <input
              type="text"
              placeholder="Location"
              class="bg-base input w-full rounded-[3px] border-[1px] px-3 py-2 text-base text-base-content placeholder:text-base placeholder:text-base-content placeholder:opacity-70 focus:border-secondary focus:outline-0 "
              [formControl]="location"
            />
          </div>
          <ul
            class="flex h-full w-full flex-col  bg-neutral/20 p-0 py-2 sm1:w-[223px]"
          >
            <ng-content />

            <button
              (click)="scheduleClick(); closeModal()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="calendar" /> Schedule
            </button>
            <div class="h-full"></div>

            <button
              (click)="closeModal()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="x" /> close
            </button>
          </ul>
        </div>
      </div>
    </modal>
  `,
})
export class ForcedScheduleModalComponent {
  description = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  location = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  startDate = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  endDate = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  date = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  projectId = new FormControl(-1, {
    nonNullable: true,
    validators: [Validators.required],
  });
  // projectId = signal(-1);

  taskService = inject(TaskService);
  consultationStateService = inject(ConsultationStateService);
  consultationService = inject(ConsultationService);
  authService = inject(AuthService);
  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService);
  showSpinner = this.spinner.show();

  projects$ = this.projectService.getProjects().pipe(take(2));

  epochToDate(epoch: number) {
    return convertUnixEpochToDateString(epoch);
  }

  epochToTime(epoch: number) {
    return getTimeFromEpoch(epoch);
  }

  scheduleClick() {
    if (this.description.invalid) {
      this.toastr.error('Description cannot be empty');

      return;
    }
    if (this.location.invalid) {
      this.toastr.error('Location cannot be empty');

      return;
    }
    if (this.date.invalid) {
      this.toastr.error('Date cannot be empty');

      return;
    }
    if (this.startDate.invalid) {
      this.toastr.error('Start time cannot be empty');

      return;
    }
    if (this.endDate.invalid) {
      this.toastr.error('End time cannot be empty');

      return;
    }

    this.spinner.show();

    const endTime = dateToEpoch(hour24ToEpoch(this.endDate.value));
    const startTime = dateToEpoch(hour24ToEpoch(this.startDate.value));
    const dateTime = combineDateAndTime(this.date.value, endTime);
    const data = {
      date_time: dateTime,
      description: this.description.value,
      endTime,
      startTime,
      location: this.location.value,
      project_id: this.projectId.value,
    };

    this.consultationService.forceSchedule(data).subscribe({
      next: (a) => {
        this.spinner.hide();
        this.toastr.success('Schedule added successfully');
        this.reset();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error('Failed to add schedule: ' + err);
        this.reset();
      },
    });
  }

  @ViewChild(ModalComponent, { static: false }) modalComponent!: ModalComponent;

  closeModal() {
    this.modalComponent.close();
  }

  reset() {
    this.date.reset();
    this.startDate.reset();
    this.endDate.reset();
    this.description.reset();
    this.location.reset();
    this.projectId.reset();
  }
}
