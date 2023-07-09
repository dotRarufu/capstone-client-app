import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'TitleAnalyzerModal',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  template: `
    <Modal
      inputId="titleAnalyzer"
      (checkboxChanged)="handleCheckboxChange($event)"
    >
      <div class="flex w-full flex-col gap-[16px] bg-base-100 p-6">
        <ng-container *ngIf="alreadyHaveTitle">
          <h1
            class="text-center text-[24px] text-base-content min-[444px]:text-left"
          >
            Enter your capstone project title
          </h1>
          <p class="text-base text-base-content/70">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea.
          </p>

          <textarea
            [(ngModel)]="titleFromAlreadyHaveTitle"
            class="textarea-bordered textarea h-[136px] rounded-[3px] border-base-content/50 text-base  text-base-content placeholder:text-base-content/70"
            placeholder="Development and Evaluation of ..."
          ></textarea>

          <div class="flex">
            <!-- todo: maybe we can set the default border in daisy ui config -->
            <button class="btn-ghost btn grow rounded-[3px] text-base-content">
              Cancel
            </button>
            <button
              onclick="titleAnalyzer.showModal()"
              (click)="navigateTo('title-analyzer-result')"
              class="btn-primary btn grow rounded-[3px]"
            >
              Next
            </button>
          </div>
        </ng-container>

        <ng-container *ngIf="!alreadyHaveTitle">
          <h1
            class="text-center text-[24px] text-base-content min-[444px]:text-left"
          >
            Title Analyzer
          </h1>
          <p class="text-base text-base-content/70">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea.
          </p>
          <div class="flex flex-col items-center gap-4 min-[444px]:items-end">
            <button (click)="nextBlock()" class="btn-link btn w-fit">
              I already have a title
            </button>
            <button
              onclick="titleAnalyzer.showModal()"
              (click)="toTitleBuilder()"
              class="btn-link btn w-fit text-base-content no-underline"
            >
              I don't have a title yet
            </button>
          </div>
        </ng-container>
      </div>
    </Modal>
  `,
})
export class TitleAnalyzerModalComponent {
  alreadyHaveTitle = false;
  titleFromAlreadyHaveTitle = '';
  @Output() alreadyHaveTitleEvent = new EventEmitter<boolean>();

  constructor(
    private projectService: ProjectService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  nextBlock() {
    this.alreadyHaveTitle = true;
    this.alreadyHaveTitleEvent.emit(this.alreadyHaveTitle);
  }

  handleCheckboxChange(e: boolean) {
    this.alreadyHaveTitle = !e;
    this.alreadyHaveTitleEvent.emit(this.alreadyHaveTitle);
  }

  async navigateTo(path: string) {
    this.spinner.show();

    await this.projectService.analyzeTitle(this.titleFromAlreadyHaveTitle);
    this.spinner.hide();
    this.router.navigate(['s', 'home', path], {});
  }

  toTitleBuilder() {
    this.router.navigate(['s', 'title-builder']);
  }
}
