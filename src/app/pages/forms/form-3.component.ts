import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  EMPTY,
  catchError,
  filter,
  finalize,
  skip,
  switchMap,
  tap,
} from 'rxjs';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ConsultationService } from 'src/app/services/consultation.service';
import { FormGeneratorService } from 'src/app/services/form-generator.service';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';
import { isNotNull } from 'src/app/utils/isNotNull';

@Component({
  standalone: true,
  imports: [
    NgxDocViewerModule,
    CommonModule,
    FeatherIconsModule,
    ReactiveFormsModule,
  ],
  template: `
    <div
      class="relative flex h-full w-full justify-center"
      *ngIf="{ dateTime: dateTimes$ | async, src: src$ | async } as observables"
    >
      <select
        [formControl]="dateTime"
        *ngIf="formNumber === 3"
        class="select-bordered select absolute right-2 top-2 border-base-content/30 bg-base-content/10 text-base font-normal focus:rounded-[3px]"
      >
        <option disabled [ngValue]="-1">Select a date</option>
        <option
          *ngFor="let dateTime of observables.dateTime"
          [ngValue]="dateTime.date_time"
        >
          {{ toDateString(dateTime.date_time) }}
        </option>
      </select>

      <ngx-doc-viewer
        *ngIf="
          observables.src !== null && observables.src !== undefined;
          else empty
        "
        [url]="observables.src || ''"
        viewer="office"
        style="width:100%;height:100%;"
      />

      <ng-template #empty>
        <div
          class=" flex flex-col items-center justify-center gap-[8px]
        text-base-content/50"
        >
          <i-feather name="calendar" class="" />
          <span class="text-base">Select a date</span>
        </div>
      </ng-template>
    </div>
  `,
})
export class Form3Component {
  formGeneratorService = inject(FormGeneratorService);
  spinner = inject(NgxSpinnerService);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);
  consultationService = inject(ConsultationService);

  formNumber = Number(this.route.snapshot.url[0].path);
  projectId = Number(this.route.parent!.parent!.parent!.snapshot.url[0].path);
  // dateTimeSubject = new BehaviorSubject<number | null>(null);

  dateTime = new FormControl(-1, {
    nonNullable: true,
  });

  dateTimes$ = this.consultationService.getConsultations(2, this.projectId);
  src$ = this.dateTime.valueChanges.pipe(
    tap((_) => this.spinner.show()),
    switchMap((a) =>
      this.formGeneratorService.generateForm(
        this.projectId,
        this.formNumber,
        this.dateTime.value
      )
    ),
    tap((_) => {
      this.toastr.success('Form generated');
      this.spinner.hide();
    }),
    catchError((err) => {
      this.toastr.error('Could not generate form:', err);
      this.spinner.hide();

      return EMPTY;
    })
  );

  toDateString(unix: number) {
    return convertUnixEpochToDateString(unix);
  }
}
