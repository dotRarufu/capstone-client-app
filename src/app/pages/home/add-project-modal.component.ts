import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { ProjectService } from 'src/app/services/project.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'add-project-modal',
  standalone: true,
  imports: [ModalComponent, FeatherModule, ReactiveFormsModule, CommonModule],
  template: `
    <modal
      *ngIf="{ sections: sections$ | async } as observables"
      inputId="addProject"
      (closed)="handleCloseEvent()"
    >
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
              class="textarea h-[117px] w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 leading-normal placeholder:text-base-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0 text-base-content"
              placeholder="Full Title"
            ></textarea>

            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Section</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <div class="join flex w-full">
              <input
                [formControl]="section"
                class="input join-item  w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 leading-normal placeholder:text-base-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0 text-base-content"
                placeholder="New Section"
              />
              <div class="form-control join-item ">
                <div
                  class="input-group rounded-[3px] border border-base-content/50"
                >
                  <select
                    class="select-bordered select w-full rounded-[3px] border-none font-normal  text-base-content  focus:rounded-[3px] "
                  >
                    <option disabled selected>Sections</option>

                    <option
                      *ngFor="let s of observables.sections"
                      (click)="section.setValue(s)"

                    >
                      {{ s }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <ul class=" flex w-full flex-col  bg-neutral/20 p-0 sm1:w-[223px] ">
            <button
            onclick="addProject.close()"
              (click)="addProject()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="check-square" />
              done
            </button>

            <div class="h-full"></div>

            <button
            onclick="addProject.close()"
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
  name = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern('^[A-Za-z0-9\\s!:\'"()\\-]+$')],
});
  fullTitle = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern('^[A-Za-z0-9\\s!:\'"()\\-]+$')] });
  section = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern('^[A-Za-z0-9\\s!:\'"()\\-]+$')] });

  projectService = inject(ProjectService);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);

  sections$ = this.projectService
    .getSections()
    .pipe(
      map((sections) =>
        sections
          .map((s) => s.section)
          .map((s) => (s === null ? 'No Section' : s))
      )
    );

  addProject() {
    if (this.name.invalid) {
      this.toastr.error("Invalid project name");

      return;
    }
    if (this.fullTitle.invalid) {
      this.toastr.error("Invalid title");

      return;
    }
    if (this.section.invalid) {
      this.toastr.error("Invalid section");

      return;
    }

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
