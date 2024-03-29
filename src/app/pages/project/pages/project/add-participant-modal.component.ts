import { Component, inject, signal } from '@angular/core';
import { AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidatorFn,
  Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { switchMap } from 'rxjs';
import { MilestoneService } from 'src/app/services/milestone.service';
// import {} from 'validator';

@Component({
  selector: 'add-participant-modal',
  standalone: true,
  imports: [ModalComponent, FeatherIconsModule, ReactiveFormsModule],
  template: `
    <modal inputId="addParticipant">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between">
            <input
              [formControl]="userUid"
              type="text"
              placeholder="User ID"
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
            <div class="h-[2px] w-full bg-base-content/10"></div>

            <div class="form-control rounded-[3px] border-[1px]">
              <div
                class="input-group rounded-[3px] border border-base-content/50"
              >
                <select
                  [formControl]="role"
                  class="select-bordered select w-full rounded-[3px] border-none font-normal text-base-content  outline-0  focus:rounded-[3px] "
                >
                  <!-- todo: make this dynamic -->
                  <option disabled [ngValue]="-1">Select a role</option>
                  <option [ngValue]="0">Student</option>
                  <option [ngValue]="1">Subject Adviser</option>
                  <option [ngValue]="2">Technical Adviser</option>
                </select>
              </div>
            </div>
          </div>
          <ul class="flex w-full flex-col bg-neutral/20 p-0 py-2 sm1:w-[223px]">
            <button
              onclick="addParticipant.close()"
              (click)="addParticipant()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="check-square" />
              done
            </button>

            <div class="h-full"></div>
            <button
              onclick="addParticipant.close()"
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
export class AddParticipantModalComponent {
  userUid = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, this.userIdValidator()],
  });

  spinner = inject(NgxSpinnerService);
  projectService = inject(ProjectService);
  milestoneService = inject(MilestoneService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);

  role = new FormControl(-1, {
    nonNullable: true,
    validators: [Validators.required],
  });

  userIdValidator(): ValidatorFn {
    return (control: AbstractControl) => {
       const pattern = /\s/;
      if (pattern.test(control.value)) return { hasSpace: true };

      return null;
    };
  }

  addParticipant() {
    if (this.userUid.invalid) {
      this.toastr.error('Invalid User ID');

      return;
    }
    if (this.role.value === -1) {
      this.toastr.error('Role cannot be empty');

      return;
    }

    this.spinner.show();
    const projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);
    const addParticipant$ = this.projectService
      .addParticipant(this.userUid.value, projectId, this.role.value)
      .pipe(
        switchMap((_) =>
          this.milestoneService.applyCapstoneAdviserTemplate(
            this.userUid.value,
            projectId
          )
        )
      );

    addParticipant$.subscribe({
      error: (e) => {
        this.spinner.hide();
        this.toastr.error('Error occured: ' + e);
      },
      complete: () => {
        this.spinner.hide();
        this.userUid.reset();
        this.toastr.success('Participant added successfully');
      },
    });
  }
}
