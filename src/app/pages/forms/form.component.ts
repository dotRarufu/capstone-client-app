import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {
  EMPTY,
  catchError,
  filter,
  map,
  switchMap,
  tap,
  throwError,
  of,
} from 'rxjs';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { FormGeneratorService } from 'src/app/services/form-generator.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  standalone: true,
  imports: [NgxDocViewerModule, CommonModule, FeatherIconsModule],
  template: `
    <div
      class="flex h-full w-full justify-center"
      *ngIf="{
        src: src$ | async,
        missingAdvisers: missingAdvisers$ | async
      } as observables"
    >
      <ngx-doc-viewer
        *ngIf="
          observables.missingAdvisers !== undefined &&
            observables.missingAdvisers !== null &&
            observables.missingAdvisers.length === 0 &&
            observables.src;
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
          *ngIf="observables.missingAdvisers !== null"
        >
          <i-feather name="x" class="" />
          <span class="text-base"
            >The project has no
            {{ observables.missingAdvisers.join(' ') }} adviser</span
          >
        </div>
      </ng-template>
    </div>
  `,
})
export class FormComponent implements OnInit {
  formGeneratorService = inject(FormGeneratorService);
  spinner = inject(NgxSpinnerService);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);
  projectService = inject(ProjectService);

  formNumber = Number(this.route.snapshot.url[0].path);
  projectId = Number(this.route.parent!.parent!.parent!.snapshot.url[0].path);

  missingAdvisers$ = this.projectService.getAdvisers(this.projectId).pipe(
    map((advisers) => {
      let res: string[] = [];

      if (advisers.capstone_adviser_id === null) res.push('Capstone');
      if (advisers.technical_adviser_id === null) res.push('Technical');

      return res;
    })
  );
  src$ = this.missingAdvisers$.pipe(
    map((missing) => {
      if (missing.length > 0) {
        throw new Error('Insufficient adviser');
      }
    }),
    switchMap((_) =>
      this.formGeneratorService.generateForm(
        this.projectId,
        this.formNumber,
        -1
      )
    ),
    tap((_) => {
      console.log('url:', _);
      this.toastr.success('Form generated');
      this.spinner.hide();
    }),
    catchError((err) => {
      this.toastr.error('Could not generate form:', err);
      this.spinner.hide();

      return of(null);
    }),
   
  );

  ngOnInit(): void {
    this.spinner.show();
  }
}
