import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TitleAnalyzerResult } from 'src/app/models/titleAnalyzerResult';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from 'src/app/components/ui/accordion.component';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import {
  EMPTY,
  catchError,
  filter,
  forkJoin,
  from,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { formatStringArray } from 'src/app/utils/formatStringArray';
import { getReadabilityScoreMeaning } from 'src/app/utils/getReadabilityScoreMeaning';
import { AuthService } from 'src/app/services/auth.service';

interface AnalysesDataItem {
  heading: string;
  value: number;
  content: string;
}

@Component({
  selector: 'title-analyzer-result',
  standalone: true,
  imports: [
    CommonModule,
    FeatherIconsModule,
    AccordionComponent,
    NgxSpinnerModule,
  ],
  template: `
    <div
      class="flex w-full flex-col gap-[16px] sm2:max-w-[840px] md:max-w-none  lg:max-w-[1040px] "
    >
      <div class="flex justify-between gap-2">
        <h1 class="text-[24px] text-base-content">
          {{ title$ | async }}
        </h1>
        <button
          (click)="handleBackButtonClick()"
          class="btn-ghost btn-sm flex flex-row items-center gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 font-[500] text-base-content hover:border-base-content/30"
        >
          <i-feather
            class="h-[20px] w-[20px] text-base-content/70"
            name="arrow-left"
          />
          <span class="uppercase"> Back </span>
        </button>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <accordion
        *ngFor="let data of (analysesData$ | async) || []"
        [isResult]="true"
        [score]="data.value"
        [heading]="data.heading"
      >
        <div class="pt-[16px] text-base-content">
          {{ data.content }}
        </div>
      </accordion>

      <div
        class="flex w-full flex-shrink-0  basis-[294px] flex-col gap-[16px]"
      ></div>
    </div>
  `,
})
export class ResultComponent {
  informationalData: { heading: string; content: string[] }[] = [];

  @Input() sideColumn? = false;

  router = inject(Router);
  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService);

  result$ = this.projectService.analyzerResult$.pipe(
    filter((res): res is TitleAnalyzerResult => res !== undefined),
    catchError((err) => {
      this.toastr.error('Error occured while analyzing title');

      return EMPTY;
    })
  );
  title$ = this.result$.pipe(map((d) => d.title));
  analysesData$ = forkJoin({
    data: this.result$,
    titleCount: from(this.projectService.getProjectCount()),
  }).pipe(
    map(({ data, titleCount }) => {
      const substantiveWordCount: AnalysesDataItem = {
        heading: 'Substantive Word Count',
        value: data.substantive_words.count,
        content: `The title comprises ${
          data.substantive_words.count
        } significant words, specifically the following: ${formatStringArray(
          data.substantive_words.words
        )}`,
      };

      const titleUniqueness: AnalysesDataItem = {
        heading: 'Title Uniqueness',
        value: data.title_uniqueness,
        content: `The provided title was compared to a set of ${titleCount} titles from previous projects in Pamantasan ng Lungsod ng Valenzuela. The analysis revealed that the title exhibits ${data.title_uniqueness}% uniqueness in relation to the existing titles.`,
      };
      const readability: AnalysesDataItem = {
        heading: 'Readability',
        value: data.readability,
        content: `The title is easily comprehensible for a ${getReadabilityScoreMeaning(
          data.readability
        )}`,
      };

      return [substantiveWordCount, titleUniqueness, readability];
    })
  );

  handleBackButtonClick() {
    this.projectService.clearAnalyzerResult();
    this.router.navigate(['s', 'home', 'title-analyzer']);
  }
}
