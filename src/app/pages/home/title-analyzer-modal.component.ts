import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { ProjectService } from 'src/app/services/project.service';
import { HomeStateService } from './data-access/home-state.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { from, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'title-analyzer-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, ReactiveFormsModule],
  template: `
    <modal
      inputId="titleAnalyzer"
      (closed)="this.homeStateService.setAlreadyHaveTitle(true)"
    >
      <div class="flex w-full flex-col gap-[16px] bg-base-100 p-6">
        <ng-container *ngIf="homeStateService.alreadyHaveTitle$ | async">
          <h1
            class="text-center text-2xl text-base-content min-[444px]:text-left"
          >
            Enter your capstone project title
          </h1>
          <p class="text-base text-base-content/70">
            A title usually starts with "Development and Evaluation," followed
            by the project's name (if any), and brief descriptive words to give
            idea about the project to the readers.
          </p>

          <textarea
            [formControl]="titleFromAlreadyHaveTitle"
            class="textarea-bordered textarea h-[136px] rounded-[3px] border-base-content/50 text-base  text-base-content placeholder:text-base-content/70"
            placeholder="Development and Evaluation of ..."
          ></textarea>

          <div class="flex">
            <!-- todo: maybe we can set the default border in daisy ui config -->
            <button
              onclick="titleAnalyzer.close()"
              class="btn-ghost btn grow rounded-[3px] text-base-content"
              (click)="this.homeStateService.setAlreadyHaveTitle(false)"
            >
              Cancel
            </button>
            <button
              onclick="titleAnalyzer.close()"
              (click)="analyzeTitle()"
              class="btn-primary btn grow rounded-[3px]"
            >
              Next
            </button>
          </div>
        </ng-container>

        <ng-container *ngIf="!(homeStateService.alreadyHaveTitle$ | async)">
          <h1
            class="text-center text-[24px] text-base-content min-[444px]:text-left"
          >
            Title Analyzer
          </h1>
          <p class="text-base text-base-content/70">
            Title analyzer is a tool that checks a capstone project title for
            its readability, uniqueness, and word count, to help students craft
            a good project title. It uses the past project titles in PLV to
            generate informational data.
          </p>
          <div class="flex flex-col items-center gap-4 min-[444px]:items-end">
            <button
              (click)="this.homeStateService.setAlreadyHaveTitle(true)"
              class="btn-link btn w-fit"
            >
              I already have a title
            </button>
            <button
              onclick="titleAnalyzer.showModal()"
              (click)="this.router.navigate(['s', 'title-builder'])"
              class="btn-link btn w-fit text-base-content no-underline"
            >
              I don't have a title yet
            </button>
          </div>
        </ng-container>
      </div>
    </modal>
  `,
})
export class TitleAnalyzerModalComponent {
  titleFromAlreadyHaveTitle = new FormControl('', {
    nonNullable: true,
    validators: [Validators.pattern('^[A-Za-z0-9\\s!:\'"()\\-]+$')],
  });

  homeStateService = inject(HomeStateService);
  projectService = inject(ProjectService);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  router = inject(Router);

  analyzeTitle() {
    if (this.titleFromAlreadyHaveTitle.invalid) {
      this.toastr.error('Invalid title');

      return;
    }

    this.spinner.show();
    const analyze$ = from(
      this.projectService.analyzeTitle(this.titleFromAlreadyHaveTitle.value)
    ).pipe(
      tap(() => this.homeStateService.updateRequests())
    );

    analyze$.subscribe({
      next: (res) => {
        this.toastr.success(`Request ${res.id} has been placed in queue `);
        this.spinner.hide();
      },
      error: (err) => {
        const message = err as string;
        this.toastr.error(message);
        this.spinner.hide();
      },
    });
  }
}
