import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConsultationData } from 'src/app/models/consultationData';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ConsultationService } from 'src/app/services/consultation.service';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/types/collection';
import { dateStringToEpoch } from 'src/app/utils/dateStringToEpoch';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { of, switchMap, take, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import getDuration from 'src/app/utils/getDuration';
import formatDate from 'src/app/utils/formatDate';
import dayFromDate from 'src/app/utils/dayFromDate';
import { ConsultationStateService } from './data-access/consultations-state.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'schedule-consultation-modal',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    FeatherIconsModule,
    CommonModule,
  ],
  template: `
    <modal inputId="scheduleConsultation" (closed)="handleClosedEvent()">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex h-fit justify-between bg-primary p-[24px]">
          <div class="form-control ">
            <div
              class="input-group rounded-[3px] border border-base-content/50"
            >
              <select
                [formControl]="activeScheduleId"
                class="select-bordered select w-full rounded-[3px] border-none text-base  font-normal text-base-content focus:rounded-[3px] "
              >
                <option disabled [ngValue]="-1">Select a schedule</option>

                <option
                  *ngFor="let schedule of availableSchedules()"
                  [ngValue]="schedule.id"
                >
                  {{ formatDate(schedule.date) }} |
                  {{ getTimeFromEpoch(schedule.start_time) }}
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
            <div>
              <!-- Selected schedule details goes here -->
              <div
                *ngIf="
                  activeSchedule() !== null && activeSchedule() !== undefined
                "
                class="grid w-full grid-cols-2 gap-2 rounded-[3px] px-2 py-4 text-left"
              >
                <div class="p-0 text-base text-base-content sm1:text-[18px]">
                  {{ getDayFromDate(activeSchedule()!.date) }}
                </div>
                <div class="text-base text-base-content/70">
                  {{ formatDate(activeSchedule()!.date) }}
                </div>

                <div class="p-0 text-base text-base-content sm1:text-[18px]">
                  {{ getTimeFromEpoch(activeSchedule()!.start_time) }}
                </div>
                <span class="text-base text-base-content/70">{{
                  getDuration(
                    activeSchedule()!.start_time,
                    activeSchedule()!.end_time
                  )
                }}</span>
              </div>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

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

            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Accomplishments</h1>
              <div class="dropdown-top dropdown-end dropdown text-base-content">
                <label
                  tabindex="0"
                  class="btn-ghost btn-sm btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
                >
                  <i-feather class="text-base-content/70" name="plus" />

                  Add
                </label>
                <ul
                  tabindex="0"
                  class="dropdown-content menu z-[999] w-52 rounded-[3px] bg-base-100 p-2 shadow-md"
                >
                  <li *ngFor="let task of doneTasks()">
                    <a
                      (click)="addTask(task.id)"
                      class="flex justify-start gap-2 rounded-[3px] font-normal text-base-content"
                      >{{ task.title }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <ul class="flex h-fit  flex-col gap-2">
              <li
                *ngFor="let task of selectedTasks()"
                class="flex justify-between rounded-[3px] border px-2 py-2 text-base text-base-content shadow"
              >
                <div class="flex w-full items-center gap-2">
                  <i-feather
                    class="shrink-0 grow-0 basis-[20px] text-base-content/70"
                    name="check-circle"
                  />
                  <p class="line-clamp-1">
                    {{ task.title }}
                  </p>
                </div>

                <a
                  (click)="removeTask(task.id)"
                  class="btn-ghost btn-square btn"
                >
                  <i-feather class=" text-base-content/70" name="minus" />
                </a>
              </li>
            </ul>
          </div>
          <ul
            class="flex h-full w-full flex-col  bg-neutral/20 p-0 py-2 sm1:w-[223px]"
          >
            <button
              onclick="scheduleConsultation.close()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
              (click)="scheduleConsultation()"
            >
              <i-feather class="text-base-content/70" name="calendar" />
              schedule
            </button>

            <div class="h-full"></div>

            <button
              onclick="scheduleConsultation.close()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="x" /> cancel
            </button>
          </ul>
        </div>
      </div>
    </modal>
  `,
})
export class ScheduleConsultationModalComponent {
  description = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  location = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  activeScheduleId = new FormControl(-1, {
    nonNullable: true,
    validators: [Validators.required],
  });
  activeSchedule = computed(() => {
    const schedules = this.availableSchedules();

    if (schedules === undefined) return null;

    const active = schedules.filter((s) => s.id === this.activeScheduleId.value)[0];

    return active;
  });

  consultationService = inject(ConsultationService);
  consultationStateService = inject(ConsultationStateService);
  toastr = inject(ToastrService);
  taskService = inject(TaskService);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);

  projectId = Number(this.route.parent!.snapshot.url[0].path);

  availableSchedules = toSignal(
    this.projectService.getProjectInfo(this.projectId).pipe(
      switchMap((p) => {
        this.spinner.show();
        const uid = p.technical_adviser_id;

        if (uid === null) return of([]);

        return this.authService
          .getProjectAvailableSchedules(uid)
          .pipe(tap((v) => this.spinner.hide()));
      })
    )
  );

  doneTasks = signal<Task[]>([]);
  selectedTasks = signal<Task[]>([]);

  handleClosedEvent() {
    this.description.reset();
    this.location.reset();
  }

  scheduleConsultation() {
    if (this.description.invalid) {
      this.toastr.error('Description cannot be empty');

      return;
    }
    if (this.location.invalid) {
      this.toastr.error('Location cannot be empty');

      return;
    }
    if (this.activeScheduleId.value === -1) {
      this.toastr.error('Schedule cannot be empty');

      return;
    }

    this.spinner.show();

    const data: ConsultationData = {
      scheduleId: this.activeScheduleId.value,
      description: this.description.value,
      location: this.location.value,
      taskIds: this.selectedTasks().map((t) => t.id),
    };

    const projectId = Number(this.route.parent!.snapshot.url[0].path);
    const request$ = this.consultationService
      .scheduleConsultation(data, projectId)
      .pipe(tap(() => this.authService.signalUpdateAvailableSchedules()));

    request$.subscribe({
      next: (message) => {
        this.toastr.success('Consultation scheduled');
        this.spinner.hide();
      },
      error: (message) => {
        this.toastr.error('Failed to schedule consultation');
        this.spinner.hide();
      },
    });
  }

  addTask(id: number) {
    const selectedTasks = this.doneTasks().find((t) => t.id === id);

    if (selectedTasks === undefined) throw new Error('should be impossiobl;e');

    this.doneTasks.update((old) => old.filter((t) => t.id !== id));
    this.selectedTasks.update((old) => [...old, selectedTasks]);
  }

  removeTask(id: number) {
    return () => {
      const selectedTasks = this.selectedTasks().find((t) => t.id === id);

      if (selectedTasks === undefined)
        throw new Error('should be impossiobl;e');

      this.selectedTasks.update((old) => old.filter((t) => t.id !== id));
      this.doneTasks.update((old) => [...old, selectedTasks]);
    };
  }

  getDayFromDate(d: string) {
    return dayFromDate(new Date(d));
  }

  formatDate(d: string) {
    return formatDate(new Date(d));
  }

  getDuration(start: number, end: number) {
    return getDuration(start, end);
  }

  getTimeFromEpoch(t: number) {
    return getTimeFromEpoch(t);
  }
}
