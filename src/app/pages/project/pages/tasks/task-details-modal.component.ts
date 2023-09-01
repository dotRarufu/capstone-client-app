import { Component, signal, inject } from '@angular/core';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from 'src/app/services/task.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { TaskStateService } from './data-access/tasks-state.service';
import { filter } from 'rxjs';
import { isNotNull } from 'src/app/utils/isNotNull';

@Component({
  selector: 'task-details-modal',
  standalone: true,
  imports: [
    ModalComponent,
    FeatherIconsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  template: `
    <modal inputId="taskDetails" (closed)="handleClosedEvent()">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
        *ngIf="{
          activeTask: taskStateService.activeTask$ | async
        } as observables"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex flex-col justify-between">
            <h1 *ngIf="!isInEdit()" class="text-[24px] text-primary-content">
              {{ observables.activeTask?.title }}
            </h1>
            <input
              *ngIf="isInEdit()"
              [formControl]="title"
              type="text"
              placeholder="Task Title"
              class="input w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 bg-primary px-3 py-2 text-[20px] text-primary-content placeholder:text-[20px] placeholder:text-primary-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0 "
            />

            <div
              *ngIf="!isInEdit()"
              class="text-[12px] text-primary-content/50"
            >
              Created at {{ observables.activeTask?.date_added }} by
              {{ observables.activeTask?.assigner_id }} | Currently in
              {{ observables.activeTask?.status_id }}
            </div>
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

            <div *ngIf="!isInEdit()" class="text-base text-base-content">
              {{ observables.activeTask?.description }}
            </div>
            <textarea
              *ngIf="isInEdit()"
              [formControl]="description"
              class="textarea h-[117px] w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 leading-normal text-base-content placeholder:text-base-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0"
              placeholder="Description"
            ></textarea>
          </div>
          <ul class=" flex w-full flex-col  bg-neutral/20 py-2 sm1:w-[223px]">
            <label
              (click)="this.isInEdit.set(true)"
              *ngIf="!isInEdit() && ['c', 't'].includes(role)"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="edit" />
              edit
            </label>
            <button
              (click)="handleDeleteClick()"
              *ngIf="!isInEdit() && ['c', 't'].includes(role)"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="user-check" />
              Delete
            </button>
            <button
              (click)="handleSaveClick()"
              *ngIf="isInEdit() && ['c', 't'].includes(role)"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="user-check" />
              Save
            </button>

            <div class="h-full"></div>

            <button
              *ngIf="!isInEdit()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="x-circle" />
              Close
            </button>
            <label
              (click)="this.isInEdit.set(false)"
              *ngIf="isInEdit() && ['c', 't'].includes(role)"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="user-check" />
              Cancel
            </label>
          </ul>
        </div>
      </div>
    </modal>
  `,
})
export class TaskDetailsModalComponent {
  route = inject(ActivatedRoute);
  taskService = inject(TaskService);
  toastr = inject(ToastrService);
  taskStateService = inject(TaskStateService);

  role: 's' | 't' | 'c' = this.route.snapshot.data['role'];

  isInEdit = signal(false);
  description = new FormControl('', { nonNullable: true });
  title = new FormControl('', { nonNullable: true });

  // todo: delete add task comp, use this instead
  handleSaveClick() {
    const task = this.taskStateService.getActiveTask();
    if (task === null) return;

    this.taskService
      .edit(task.id, this.title.value, this.description.value)
      .subscribe({
        next: () => {
          this.toastr.success('task edited successfully');
          this.isInEdit.set(false);
        },
        error: () => {
          this.toastr.error('failed to edit task');
          this.isInEdit.set(false);
        },
      });
  }

  handleDeleteClick() {
    const task = this.taskStateService.getActiveTask();

    this.taskService.delete(task!.id, task!.assigner_id).subscribe({
      next: (status) => {
        this.toastr.success(status);
      },
      error: (err) => {
        this.toastr.error(err);
      },
    });
  }

  handleClosedEvent() {
    this.description.reset();
    this.title.reset();
  }
}
