import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, catchError, tap } from 'rxjs';
import { FormGeneratorService } from 'src/app/services/form-generator.service';

@Component({
  standalone: true,
  imports: [NgxDocViewerModule, CommonModule],
  template: `
    <div class="flex h-full w-full justify-center ">
      <ngx-doc-viewer
        (loaded)="this.spinner.hide()"
        [url]="(src$ | async) || ''"
        viewer="office"
        style="width:100%;height:100%;"
      />
    </div>
  `,
})
export class FormComponent {
  formGeneratorService = inject(FormGeneratorService);
  spinner = inject(NgxSpinnerService);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);

  formNumber = Number(this.route.snapshot.url[0].path);
  projectId = Number(this.route.parent!.parent!.parent!.snapshot.url[0].path);

  src$ = this.formGeneratorService
    .generateForm(this.projectId, this.formNumber)
    .pipe(
      tap((_) => this.toastr.success('successfully generated form')),
      catchError((err) => {
        this.toastr.error('error generating form:', err);
        this.spinner.hide();

        return EMPTY;
      })
    );
}
