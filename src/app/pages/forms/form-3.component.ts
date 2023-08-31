import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
  imports: [NgxDocViewerModule, CommonModule, FeatherIconsModule],
  template: `
    <div
      class="relative flex h-full w-full justify-center"
      *ngIf="{ dateTime: dateTimes$ | async, src: src$ | async } as observables"
    >
      <select
        *ngIf="formNumber === 3"
        class="select-bordered select absolute right-2 top-2 border-base-content/30 bg-base-content/10 text-base font-normal focus:rounded-[3px]"
      >
        <option disabled selected>Select a date</option>
        <option
          *ngFor="let dateTime of observables.dateTime"
          (click)="handleDateClick(dateTime.date_time)"
        >
          {{ toDateString(dateTime.date_time) }}
        </option>
      </select>

      <ngx-doc-viewer
        *ngIf="observables.src !== null; else empty"
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
  dateTimeSubject = new BehaviorSubject<number | null>(null);

  dateTimes$ = this.consultationService.getConsultations(2, this.projectId);
  src$ = this.dateTimeSubject.pipe(
    filter(isNotNull),
    switchMap((dateTime) =>
      this.formGeneratorService.generateForm(
        this.projectId,
        this.formNumber,
        dateTime
      )
    ),
    tap((_) => {
      this.toastr.success('successfully generated form');
      this.spinner.hide();
    }),
    catchError((err) => {
      this.toastr.error('error generating form:', err);
      this.spinner.hide();

      return EMPTY;
    }),
    finalize(() => {
      console.log('COMPLETES!');
    })
  );

  handleDateClick(unix: number) {
    this.dateTimeSubject.next(unix);
    this.spinner.show();
  }

  toDateString(unix: number) {
    return convertUnixEpochToDateString(unix);
  }
}
