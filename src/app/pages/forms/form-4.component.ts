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
        *ngIf="observables.src !== null"
        [url]="observables.src || ''"
        viewer="office"
        style="width:100%;height:100%;"
      />
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
    filter(isNotNull),
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

  ngOnInit(): void {
    this.spinner.show()
  }
}
