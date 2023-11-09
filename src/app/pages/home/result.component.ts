import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { formatStringArray } from 'src/app/utils/formatStringArray';
import { getReadabilityScoreMeaning } from 'src/app/utils/getReadabilityScoreMeaning';
import { AuthService } from 'src/app/services/auth.service';
import { getCategoryName } from 'src/app/utils/getCategoryName';

interface AnalysesDataItem {
  heading: string;
  value: number;
  content: string;
  images?: string[];
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
      class="flex w-full flex-col gap-[16px] sm2:max-w-[840px] md:max-w-none  lg:max-w-[1040px]"
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
          <ng-container *ngIf="data.images && data.images.length > 0">
            <div class="flex flex-wrap gap-[8px]">
              <img
                *ngFor="let image of data.images"
                [src]="image"
                class="max-h-[260px] w-full object-contain"
              />
            </div>
          </ng-container>
        </div>
      </accordion>

      <accordion
        *ngIf="annualCategoryUniqueness$ | async as data"
        [isResult]="true"
        [score]="data.score"
        [heading]="'Annual Category Uniqueness'"
      >
        <div class="flex flex-col gap-1 pt-[16px] text-base-content">
          On a 100-based scoring system, your title's category uniqueness is
          {{ data.score }}. The following are the past titles that is the same
          with the title's category:

          <ul *ngFor="let d of data.reports" class="flex w-full flex-col gap-1">
            <li
              *ngFor="let da of d.titles"
              class="flex w-full justify-between gap-2 rounded-[5px] bg-base-200 p-2"
            >
              <span class="w-[75%]">
                {{ da }}
              </span>
              <span class="w-[25%] text-sm text-base-content/50">
                {{ d.category }}
              </span>
            </li>
          </ul>
        </div>
      </accordion>
    </div>
  `,
})
export class ResultComponent {
  informationalData: { heading: string; content: string[] }[] = [];

  @Input() sideColumn? = false;

  route = inject(ActivatedRoute);
  router = inject(Router);
  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService);

  id = this.route.snapshot.paramMap.get('requestId')!;
  result$ = this.projectService.getTitleAnayzeResult(this.id).pipe(
    catchError((err) => {
      this.toastr.error('Error occured while analyzing title');

      return EMPTY;
    })
  );

  constructor() {
    const requestId = this.route.snapshot.paramMap.get('requestId');
    console.log('requestId:', requestId);
  }

  annualCategoryUniqueness$ = this.result$.pipe(
    map((d) => d.annual_category_uniqueness),
    // get category name and title
    switchMap(({ report, score }) => {
      const reqs = report.map(({ title_id_list, category_id }) => {
        const reqs = title_id_list.map((id) =>
          this.projectService.getProjectInfo(id).pipe(map((v) => v.full_title))
        );

        return forkJoin(reqs).pipe(
          map((titles) => {
            return { category: getCategoryName(category_id), titles };
          })
        );
      });

      return forkJoin(reqs).pipe(map((v) => ({ score, reports: v })));
    })
  );

  //* for dev
  devannualCategoryUniqueness$ = of('').pipe(
    map(() => {
      const res = {
        score: 83,
        report: [
          { category_id: 1, title_id_list: [1, 2, 3] },
          { category_id: 2, title_id_list: [1, 2, 3] },
        ],
        reports: [
          {
            category: 'Mobile Development',
            titles: [
              'Development and Evaluation of a Capstone Progress Tracker with Title Analyzer and Title Builder for Pamantasan ng Lungsod ng Valenzuela',
              'Folkverse Game Dev',
            ],
          },
          {
            category: 'Web Development',
            titles: [
              'Development of Capstone',
              'Development and Evaluation of a An Interactive 2D Game Instructor-Led Game for Grade 5 Students',
            ],
          },
        ],
      };

      return res;
    })
  );
  title$ = this.result$.pipe(map((d) => d.title));
  analysesData$ = forkJoin({
    data: this.result$,
    titleCount: from(this.projectService.getProjectCount()),
  }).pipe(
    switchMap(({ data, titleCount }) => {
      const categoryIds = data.category_rarity.report.map((v) => v.category_id);
      const req = forkJoin(
        categoryIds.map((id) => this.projectService.getCategoryName(id))
      ).pipe(
        map((v) => {
          const newReport = data.category_rarity.report.map((a) => {
            const match = v.find((b) => b.category_id === a.category_id)!;

            // if (!match) return a;

            return { ...a, name: match.name };
          });
          const newCategoryRarity = {
            ...data.category_rarity,
            report: newReport,
          };
          const res = {
            data: { ...data, category_rarity: newCategoryRarity },
            titleCount,
          };

          return res;
        })
      );

      return req;
    }),
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
        images: ['assets/readability-scores.PNG'],
      };

      const categoryRarity: AnalysesDataItem = {
        heading: 'Category Rarity',
        value: data.category_rarity.score,
        content: `The title is categorized as ${data.category_rarity.report.map(
          (v) => v.name
        )}, with the following score respectively: ${data.category_rarity.report.map(
          (v) => v.score
        )}`,
      };

      const annualCategoryUniqueness: AnalysesDataItem = {
        heading: 'Annual Category Uniqueness',
        value: data.annual_category_uniqueness.score,
        content: `The title is ${data.annual_category_uniqueness.score}% unique among the titles sent in this system for the current year`,
      };

      // annual category uniqueness
      // category rarity

      // use initial title
      return [
        substantiveWordCount,
        titleUniqueness,
        readability,
        categoryRarity,
        annualCategoryUniqueness,
      ];
    })
  );

  handleBackButtonClick() {
    this.projectService.clearAnalyzerResult();
    this.router.navigate(['s', 'home', 'title-analyzer']);
  }
}
