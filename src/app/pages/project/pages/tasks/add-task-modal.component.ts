import { Component, inject } from '@angular/core';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { TaskStateService } from './data-access/tasks-state.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'add-task-modal',
  standalone: true,
  imports: [ModalComponent, FeatherIconsModule, ReactiveFormsModule],
  template: `
    <modal inputId="addTask" (closed)="handleCloseEvent()">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between">
            <input
              [formControl]="title"
              type="text"
              placeholder="Task Title"
              class="input w-full rounded-[3px]   bg-primary px-3 py-2 text-[20px] text-primary-content placeholder:text-[20px] placeholder:text-primary-content placeholder:opacity-70 border-[1px] focus:border-secondary focus:outline-0 "
            />
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

            <textarea
              [formControl]="description"
              class="textarea h-[117px] w-full rounded-[3px] border-[1px] leading-normal text-base-content placeholder:text-base-content placeholder:opacity-70 focus:border-secondary focus:outline-0"
              placeholder="Description"
            ></textarea>
          </div>
          <ul
            class="flex w-full flex-col  bg-neutral/20 p-0 py-2 sm1:w-[223px]"
          >
            <button
              onclick="addTask.close()"
              (click)="handleDoneClick()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="check-square" />
              done
            </button>

            <div class="h-full"></div>
            <button
              onclick="addTask.close()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="x-circle" />
              close
            </button>
          </ul>
        </div>
      </div>
    </modal>
  `,
})
export class AddTaskModalComponent {
  title = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  description = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  taskService = inject(TaskService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  taskStateService = inject(TaskStateService);
  spinner = inject(NgxSpinnerService);

  handleCloseEvent() {
    this.title.setValue('');
    this.description.setValue('');
  }

  handleDoneClick() {
    if (this.title.invalid) {
      this.toastr.error('Task title cannot be empty');

      return;
    }
    if (this.description.invalid) {
      this.toastr.error('Task description cannot be empty');

      return;
    }

    const projectId = Number(this.route.parent!.snapshot.url[0].path);

    const tasks = this.taskStateService.getTasks();

    if (tasks.length > 5) {
      this.toastr.error('Tasks in todo is already reached');

      return;
    }
    this.spinner.show();

    // * completes
    const status$ = this.taskService.add(
      this.title.value,
      this.description.value,
      projectId
    );

    status$.subscribe({
      next: (status) => {
        this.spinner.hide();
        this.toastr.success("Task added");
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error("Failed to add task");
      },
    });
  }
}
