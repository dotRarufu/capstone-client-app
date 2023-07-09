import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { switchMap } from 'rxjs';
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
        style="width:100%;height:100vh;"
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
  src =
    'https://iryebjmqurfynqgjvntp.supabase.co/storage/v1/object/public/chum-bucket/form_2_project_0.docx?t=2023-05-18T14%3A11%3A02.027Z';
  formNumber = -1;

  constructor(
    private projectService: ProjectService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {
    this.spinner.show();
    const url$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const formNumber = params.get('formNumber');

        if (formNumber === null) throw new Error('shold be impossible');

        return formNumber;
      }),
      switchMap((formNumber) =>
        this.projectService.generateForm(Number(formNumber))
      )
    );

    url$.subscribe({
      next: (url) => {
        this.src = url;
      },
    });
  }

  finishedLoading() {
    this.spinner.hide();
  }
}
