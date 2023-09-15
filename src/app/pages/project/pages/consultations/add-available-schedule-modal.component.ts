import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { ProjectService } from 'src/app/services/project.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { filter, map, switchMap } from 'rxjs';
import { isNotNull } from 'src/app/utils/isNotNull';
import { AuthService } from 'src/app/services/auth.service';
import timeToEpoch from 'src/app/utils/timeToEpoch';

@Component({
  selector: 'add-available-schedule-modal',
  standalone: true,
  imports: [ModalComponent, FeatherModule, ReactiveFormsModule, CommonModule],
  template: `
    <modal
      *ngIf="{ sections: sections$ | async } as observables"
      inputId="addAvailableSchedule"
      (closed)="handleCloseEvent()"
    >
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between">
            <input
              [formControl]="date"
              type="date"
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
              <h1 class="text-[20px] text-base-content">Time</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <div class="flex flex-col items-center gap-2 sm1:flex-row">
              <input
                [formControl]="startTime"
                type="time"
                placeholder="Start"
                class="bg-base input w-full rounded-[3px] px-3 py-2 text-base text-base-content placeholder:text-base placeholder:text-base-content placeholder:opacity-70 focus:border-l-[3px] focus:border-secondary focus:outline-0 "
              />
              <span class="text-base-content"> TO </span>
              <input
                [formControl]="endTime"
                type="time"
                placeholder="End"
                class="bg-base input w-full rounded-[3px] px-3 py-2 text-base text-base-content placeholder:text-base placeholder:text-base-content placeholder:opacity-70 focus:border-l-[3px] focus:border-secondary focus:outline-0 "
              />
            </div>
          </div>

          <ul class=" flex w-full flex-col  bg-neutral/20 p-0 sm1:w-[223px] ">
            <button
              (click)="add()"
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
export class AddAvailableScheduleModalComponent {
  date = new FormControl('', { nonNullable: true });
  startTime = new FormControl('', { nonNullable: true });
  endTime = new FormControl('', { nonNullable: true });
  // section = new FormControl('', { nonNullable: true });

  projectService = inject(ProjectService);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  authService = inject(AuthService);

  sections$ = this.projectService
    .getSections()
    .pipe(
      map((sections) =>
        sections
          .map((s) => s.section)
          .map((s) => (s === null ? 'No Section' : s))
      )
    );

  add() {
    this.spinner.show();
    const startTime = timeToEpoch(this.startTime.value);
    const endTime = timeToEpoch(this.endTime.value);

    const user$ = this.authService
      .getAuthenticatedUser()
      .pipe(filter(isNotNull));
    user$
      .pipe(
        switchMap((u) =>
          this.authService.addAvailableSchedule(
            u.uid,
            this.date.value,
            startTime,
            endTime
          )
        )
      )
      .subscribe({
        next: (a) => {
          this.spinner.hide();
          this.toastr.success('Schedule added successfully');
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error('Failed to schedule');
        },
      });
  }

  handleCloseEvent() {
    // this.name.reset();
    // this.fullTitle.reset();
    // this.section.reset();
  }
}
