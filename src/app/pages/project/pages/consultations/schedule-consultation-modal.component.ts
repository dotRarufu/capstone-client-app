import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConsultationData } from 'src/app/models/consultationData';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ConsultationService } from 'src/app/services/consultation.service';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/types/collection';
import { dateStringToEpoch } from 'src/app/utils/dateStringToEpoch';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { take } from 'rxjs';

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
          <div class="flex w-full flex-col justify-between gap-4">
            <input
              type="datetime-local"
              [formControl]="dateTime"
              class="input w-full rounded-[3px] border-y-0 border-l-[3px] border-r-0 border-l-primary-content/50 bg-transparent px-3 py-2 text-[20px] text-base text-primary-content/70 placeholder:text-[20px] placeholder:text-primary-content/70 placeholder:opacity-70 focus:border-l-[3px] focus:border-l-secondary focus:outline-0 "
            />
          </div>
        </div>
        <div
          class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
        >
          <div
            class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4 sm1:overflow-y-scroll"
          >
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Description</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <textarea
              class="textarea h-[117px] w-full shrink-0 rounded-[3px] border-y-0 border-l-[3px] border-r-0 border-l-base-content/50 text-base leading-normal text-base-content placeholder:text-base-content placeholder:opacity-70 focus:border-l-[3px] focus:border-l-secondary focus:outline-0"
              placeholder="Description"
              [formControl]="description"
            ></textarea>

            <input
              type="text"
              placeholder="Location"
              class="bg-base input w-full rounded-[3px] border-y-0 border-l-[3px] border-r-0 border-l-base-content/50 px-3 py-2 text-base text-base-content placeholder:text-base placeholder:text-base-content placeholder:opacity-70 focus:border-l-[3px] focus:border-l-secondary focus:outline-0 "
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
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
              (click)="scheduleConsultation()"
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
    </modal>
  `,
})
export class ScheduleConsultationModalComponent implements OnInit {
  dateTime = new FormControl('', { nonNullable: true });
  description = new FormControl('', { nonNullable: true });
  location = new FormControl('', { nonNullable: true });
  
  doneTasks = signal<Task[]>([]);
  selectedTasks = signal<Task[]>([]);

  consultationService = inject(ConsultationService);
  toastr = inject(ToastrService);
  taskService = inject(TaskService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    const projectId = Number(this.route.parent!.snapshot.url[0].path);

    const doneTasks$ = this.taskService.getTasks(2, projectId);
    doneTasks$.pipe(take(1)).subscribe({
      next: (tasks) => this.doneTasks.set(tasks),
      error: () => this.toastr.error('error getting done tasks'),
    });
  }

  handleClosedEvent() {
    this.dateTime.reset();
    this.description.reset();
    this.location.reset();
  }

  scheduleConsultation() {
    const epochDateTime = dateStringToEpoch(this.dateTime.value);

    const data: ConsultationData = {
      dateTime: epochDateTime,
      description: this.description.value,
      location: this.location.value,
      taskIds: this.selectedTasks().map((t) => t.id),
    };

    const projectId = Number(this.route.parent!.snapshot.url[0].path);
    const request$ = this.consultationService.scheduleConsultation(
      data,
      projectId
    );

    request$.subscribe({
      next: (message) => this.toastr.success('created'),
      error: (message) => this.toastr.error(message),
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
}
