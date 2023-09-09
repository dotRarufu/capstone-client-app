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
      *ngIf="{ src: src$ | async, advisers: advisers$ | async } as observables"
    >
     
      <ngx-doc-viewer
        *ngIf="observables.advisers === null; else empty"
        [url]="observables.src || ''"
        viewer="office"
        (loaded)="handleLoaded()"
        style="width:100%;height:100%;"
      />

      <ng-template #empty>
        <div
          class=" flex flex-col items-center justify-center gap-[8px]
        text-base-content/50"
          *ngIf="observables.advisers!.length > 0"
        >
          <i-feather name="x" class="" />
          <span class="text-base"
            >The project has no
            {{ observables.advisers!.join(' ') }} adviser</span
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
  handleLoaded() {
    console.log('LODADED!');
  }
  formNumber = Number(this.route.snapshot.url[0].path);
  projectId = Number(this.route.parent!.parent!.parent!.snapshot.url[0].path);

  advisers$ = this.projectService.getAdvisers(this.projectId).pipe(
    map((advisers) => {
      let res: string[] = [];

      if (advisers.capstone_adviser_id === null) res.push('Capstone');
      if (advisers.technical_adviser_id === null) res.push('Technical');

      return res;
    })
  );
  src$ = this.advisers$.pipe(
    map((missing) => {
      if (missing.length > 0) {
        this.spinner.hide();
        return 'skip';
      }

      return missing;
    }),
    filter((v) => v !== 'skip'),
    switchMap((_) =>
      this.formGeneratorService.generateForm(
        this.projectId,
        this.formNumber,
        -1
      )
    ),
    tap((_) => {
      console.log('url:', _);
      this.toastr.success('successfully generated form');
      this.spinner.hide();
    }),
    catchError((err) => {
      this.toastr.error('error generating form:', err);
      this.spinner.hide();

      return EMPTY;
    })
  );

  ngOnInit(): void {
    this.spinner.show();
  }
}
