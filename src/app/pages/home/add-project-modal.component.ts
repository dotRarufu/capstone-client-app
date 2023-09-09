import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { ProjectService } from 'src/app/services/project.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'add-project-modal',
  standalone: true,
  imports: [ModalComponent, FeatherModule, ReactiveFormsModule],
  template: `
    <modal inputId="addProject" (closed)="handleCloseEvent()">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between">
            <input
              type="text"
              [formControl]="name"
              placeholder="Project Name"
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
              [formControl]="fullTitle"
              class="textarea h-[117px] w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 leading-normal placeholder:text-base-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0"
              placeholder="Full Title"
            ></textarea>

            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Section</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <input
              [formControl]="section"
              class="input  w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 leading-normal placeholder:text-base-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0"
              placeholder="Section"
            />
          </div>

          <ul class=" flex w-full flex-col  bg-neutral/20 p-0 sm1:w-[223px] ">
            <button
              (click)="addProject()"
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
    </modal>
  `,
})
export class AddProjectModalComponent {
  name = new FormControl('', { nonNullable: true });
  fullTitle = new FormControl('', { nonNullable: true });
  section = new FormControl('', { nonNullable: true });

  projectService = inject(ProjectService);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);

  addProject() {
    this.spinner.show();
    this.projectService
      .createProject(this.name.value, this.fullTitle.value, this.section.value)
      .subscribe({
        next: (a) => {
          this.spinner.hide();
          this.toastr.success('Project added successfully');
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error('Failed to add project');
        },
      });
  }

  handleCloseEvent() {
    this.name.reset();
    this.fullTitle.reset();
    this.section.reset();
  }
}
