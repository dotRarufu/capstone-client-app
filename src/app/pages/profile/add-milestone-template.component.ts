import { Component, inject } from '@angular/core';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { filter, from, map, switchMap } from 'rxjs';
import { MilestoneService } from 'src/app/services/milestone.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { isNotNull } from 'src/app/utils/isNotNull';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'add-milestone-template-modal',
  standalone: true,
  imports: [ModalComponent, FeatherIconsModule, ReactiveFormsModule],
  template: `
    <modal inputId="addMilestone" (closed)="resetForms()">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between">
            <input
              [formControl]="title"
              type="text"
              placeholder="Enter milestone title"
              class="input w-full rounded-[3px]   border-[1px] bg-primary px-3 py-2 text-[20px] text-primary-content placeholder:text-[20px] placeholder:text-primary-content placeholder:opacity-70 focus:border-secondary focus:outline-0 "
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
              class="textarea h-[117px] w-full rounded-[3px] border-[1px] border-r-0 leading-normal text-base-content placeholder:text-base-content placeholder:opacity-70 focus:border-secondary focus:outline-0"
              placeholder="Description"
            ></textarea>

            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Due Date</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <input
              type="date"
              [formControl]="dueDate"
              class="input w-full rounded-[3px]  border-[1px] bg-base-100 px-3 py-2 text-[20px] text-base text-base-content text-base-content/70 placeholder:text-[20px] placeholder:text-base-content/70 placeholder:opacity-70 focus:border-secondary focus:outline-0"
            />
          </div>

          <ul
            class="flex w-full flex-col  bg-neutral/20 p-0 py-2 sm1:w-[223px]"
          >
            <button
              onclick="addMilestone.close()"
              (click)="handleDoneClick()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="check-square" />
              done
            </button>

            <div class="h-full"></div>
            <button
              onclick="addMilestone.close()"
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
export class AddMilestoneTemplateModalComponent {
  title = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  description = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  dueDate = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  authService = inject(AuthService);
  milestoneService = inject(MilestoneService);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);

  handleDoneClick() {
    if (this.title.invalid) {
      this.toastr.error('Title cannot be empty');

      return;
    }
    if (this.description.invalid) {
      this.toastr.error('Description cannot be empty');

      return;
    }
    if (this.dueDate.invalid) {
      this.toastr.error('Due date cannot be empty');

      return;
    }

    this.spinner.show();
    const user$ = this.authService.getAuthenticatedUser();
    const status$ = user$.pipe(
      filter(isNotNull),
      switchMap(({ uid }) =>
        this.milestoneService.addTemplate(uid, {
          title: this.title.value,
          description: this.description.value,
          dueDate: this.dueDate.value,
        })
      )
    );

    status$.subscribe({
      next: (status) => {
        this.spinner.hide();
        this.toastr.success('Success');
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error('Error occured: ' + err);
      },
      complete: () => {},
    });
  }

  resetForms() {
    this.title.reset();
    this.description.reset();
    this.dueDate.reset();
  }
}
