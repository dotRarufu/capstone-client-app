import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGeneratorService } from 'src/app/services/form-generator.service';

@Component({
  standalone: true,
  imports: [NgxSpinnerModule, NgxDocViewerModule],
  template: `
    <div class="flex h-full w-full justify-center ">
      <ngx-doc-viewer
        (loaded)="finishedLoading()"
        [url]="src"
        viewer="office"
        style="width:100%;height:100%;"
      />
    </div>

    <ngx-spinner
      bdColor="rgba(0, 0, 0, 0.8)"
      size="default"
      color="#fff"
      type="square-loader"
      [fullScreen]="true"
      ><p style="color: white">Loading...</p></ngx-spinner
    >
  `,
})
export class FormComponent implements OnInit {
  src = '';
  formNumber = -1;

  formGeneratorService = inject(FormGeneratorService);
  spinner = inject(NgxSpinnerService);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);

  ngOnInit() {
    const projectId = Number(
      this.route.parent!.parent!.parent!.snapshot.url[0].path
    );
    const formNumber = Number(this.route.snapshot.url[0].path);
    this.spinner.show();
    this.formGeneratorService.generateForm(projectId, formNumber).subscribe({
      next: (url) => {
        this.src = url;
        console.log('successfully generated form:', url);
        this.toastr.success('successfullyedgenerated form');
      },
      error: (err) => {
        this.toastr.error('error generating form:', err);
        this.spinner.hide();
      },
    });
  }

  finishedLoading() {
    this.spinner.hide();
  }
}
