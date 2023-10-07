import { Component, signal, inject } from '@angular/core';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from 'src/app/services/task.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { TaskStateService } from './data-access/tasks-state.service';
import { EMPTY, filter, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { isNotNull } from 'src/app/utils/isNotNull';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';
import { NgxSpinnerService } from 'ngx-spinner';

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
          activeTask: activeTask$ | async,
          role: role$ | async,
          user: user$ | async
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
              Created at {{ observables.activeTask?.dateAdded }} by
              {{ observables.activeTask?.assigner?.name }} | Currently in
              {{ observables.activeTask?.statusName }}
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
              *ngIf="
                !isInEdit() &&
                observables.activeTask?.assigner_id === observables.user!.uid
              "
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="edit" />
              edit
            </label>
            <button
            onclick="taskDetails.close()"
              (click)="handleDeleteClick()"
              *ngIf="
                !isInEdit() &&
                observables.activeTask?.assigner_id === observables.user!.uid
              "
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="trash" />
              Delete
            </button>
            <button
            onclick="taskDetails.close()"

              (click)="handleSaveClick()"
              *ngIf="isInEdit() && observables.role?.role_id === 5"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="save" />
              Save
            </button>

            <div class="h-full"></div>

            <button
            onclick="taskDetails.close()"

              *ngIf="!isInEdit()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="x-circle" />
              Close
            </button>
            <label
              (click)="this.isInEdit.set(false)"
              *ngIf="isInEdit() && observables.role?.role_id === 5"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="x-circle" />
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
  authService = inject(AuthService);
  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);

  currentValuesSubcription = this.taskStateService.activeTask$.pipe(
    filter(isNotNull)
  ).subscribe({
    next: (v) => {
      this.description.setValue(v.description);
      this.title.setValue(v.title);
    },
  });
  projectId = Number(this.route.parent!.snapshot.url[0].path);

  role$ = this.authService.getAuthenticatedUser().pipe(filter(isNotNull));
  user$ = this.authService.getAuthenticatedUser().pipe(filter(isNotNull));

  isInEdit = signal(false);
  description = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  title = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  activeTask$ = this.taskStateService.activeTask$.pipe(
    switchMap(v => {
      if (v ===null) {
        this.spinner.hide()
        return EMPTY;
      }

      return of(v);
    }),
    switchMap((v) =>
      forkJoin({
        assigner: this.authService.getUserData(v.assigner_id),
        data: of(v),
      })
    ),
    map(({ data, assigner }) => ({ ...data, assigner })),
    map((data) => ({ ...data, statusName: this.getStatusName(data.status_id) })),
    map((data) => ({ ...data, dateAdded: this.a(data.date_added)})),
    tap(() => this.spinner.hide())
  );

  // todo: delete add task comp, use this instead
  handleSaveClick() {
    if (this.description.invalid) {
      this.toastr.error("Description cannot be empty");

      return;
    }
    if (this.title.invalid) {
      this.toastr.error("Title cannot be empty");

      return;
    }
    const task = this.taskStateService.getActiveTask();
    if (task === null) {
      this.toastr.error("Active task cannot be empty");

      return;
    }




    this.spinner.show();

    this.taskService
      .edit(task.id, this.title.value, this.description.value)
      .subscribe({
        next: () => {
          this.spinner.hide();
          this.toastr.success('Task edited successfully');
          this.isInEdit.set(false);
        },
        error: () => {
          this.spinner.hide();
          this.toastr.error('Failed to edit task');
          this.isInEdit.set(false);
        },
      });
  }

  handleDeleteClick() {
    this.spinner.show();
    const task = this.taskStateService.getActiveTask();

    this.taskService.delete(task!.id, task!.assigner_id).subscribe({
      next: (status) => {
        this.spinner.hide();
        this.toastr.success("Task deleted");
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error("Failed to delete task");
      },
    });
  }

  handleClosedEvent() {
    this.description.reset();
    this.title.reset();
  }

  a(v: number) {
    return convertUnixEpochToDateString(v);
  }

  getStatusName(id: number) {
    switch (id) {
      case 0:
        return 'To Do';
      case 1:
        return 'On Going';
      case 2:
        return 'Done';

      default:
        return 'Unknown section';
    }
  }
}
