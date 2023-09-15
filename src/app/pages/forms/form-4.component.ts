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
  map,
  of,
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
      *ngIf="{ src: src$ | async } as observables"
    >
      <ngx-doc-viewer
        *ngIf="observables.src; else empty"
        [url]="observables.src || ''"
        viewer="office"
        style="width:100%;height:100%;"
      />

      <ng-template #empty>
        <div
          class="flex flex-col items-center justify-center gap-[8px]
        text-base-content/50"
        >
          <i-feather name="x" class="" />
          <span class="text-base"
            >The project has no completed consultation</span
          >
        </div>
      </ng-template>
    </div>
  `,
})
export class Form4Component implements OnInit {
  formGeneratorService = inject(FormGeneratorService);
  spinner = inject(NgxSpinnerService);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);
  consultationService = inject(ConsultationService);

  formNumber = Number(this.route.snapshot.url[0].path);
  projectId = Number(this.route.parent!.parent!.parent!.snapshot.url[0].path);

  dateTimes$ = this.consultationService.getConsultations(2, this.projectId);
  src$ = this.dateTimes$.pipe(
    map((dateTimes) => {
      if (dateTimes.length === 0) {
        throw new Error('The project has no completed consultation');
      }

      return dateTimes;
    }),
    map((d) => d.map((e) => e.date_time)),
    switchMap((dateTimeList) =>
      this.formGeneratorService.generateForm(
        this.projectId,
        this.formNumber,
        -1,
        dateTimeList
      )
    ),
    tap((_) => {
      this.toastr.success('Form generated', );
      this.spinner.hide();
    }),
    catchError((err) => {
      this.toastr.error('Could not generate form:', err);
      this.spinner.hide();

      return of(null);
    })
  );

  ngOnInit(): void {
    this.spinner.show();
  }
}
