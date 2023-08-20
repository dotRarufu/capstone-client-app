import { Component, inject } from '@angular/core';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';
import { FormsModule } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'add-task-modal',
  standalone: true,
  imports: [ModalComponent, FeatherIconsModule, FormsModule],
  template: `
    <Modal inputId="addTask">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between">
            <input
              [(ngModel)]="title"
              type="text"
              placeholder="Task Title"
              class="input w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 bg-primary px-3 py-2 text-[20px] text-primary-content placeholder:text-[20px] placeholder:text-primary-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0 "
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
              [(ngModel)]="description"
              class="textarea h-[117px] w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 leading-normal placeholder:text-base-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0"
              placeholder="Description"
            ></textarea>
          </div>
          <ul
            class="flex w-full flex-col  bg-neutral/20 p-0 py-2 sm1:w-[223px]"
          >
            <button
              (click)="handleDoneClick()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="check-square" />
              done
            </button>

            <div class="h-full"></div>
            <button
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="x-circle" />
              close
            </button>
          </ul>
        </div>
      </div>
    </Modal>
  `,
})
export class AddTaskModalComponent {
  title = '';
  description = '';

  taskService = inject(TaskService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);

  handleDoneClick() {
    const projectId = Number(this.route.parent!.snapshot.url[0].path);

    const status$ = this.taskService.add(
      this.title,
      this.description,
      projectId
    );

    status$.subscribe({
      next: (status) => {
        this.toastr.success(status);
      },
      error: (err) => {
        this.toastr.error(err);
      },
      complete: () => {},
    });
  }
}
