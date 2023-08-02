import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { map, switchMap, tap } from 'rxjs';
import { FormGeneratorService } from 'src/app/services/form-generator.service';
import { ProjectService } from 'src/app/services/project.service';

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
export class FormComponent {
  src = "";
  formNumber = -1;

  constructor(
    private formGeneratorService: FormGeneratorService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    const projectId = Number(
      this.route.parent!.parent!.parent!.snapshot.url[0].path
    );
    const formNumber = Number(this.route.snapshot.url[0].path);
    this.spinner.show();
    this.formGeneratorService.generateForm(projectId, formNumber).subscribe({
      next: (url) => {
        this.src = url;
        console.log("successfully generated form:", url)
        this.toastr.success('successfullyedgenerated form');
      },
      error: (err) => {
        this.toastr.error('error generating form:', err);
        this.spinner.hide();
      }
    })

    // this.route.url
    //   .pipe(
    //     tap(_ => {
    //       this.spinner.show();
    //       console.log("runs change");
    //     }),
    //     map((url) => {
    //       const formNumber = Number(url[0].path);
          
    //       return formNumber;
    //     }),
    //     tap(url => console.log("request form:", url)),
    //     switchMap((formNumber) =>
    //       this.formGeneratorService.generateForm(projectId, formNumber)
    //     )
    //   )
    //   .subscribe({
    //     next: (url) => {
    //       if (url === undefined || url === null) {
    //         this.toastr.error('error generating form:', url);
    //         this.spinner.hide();
    //         return;
    //       }

    //       this.src = url;
    //       this.toastr.success('successfullyedgenerated form');

    //       console.log('generated form res:', url);
    //     },
    //   });
  }

  finishedLoading() {
    this.spinner.hide();
  }
}
