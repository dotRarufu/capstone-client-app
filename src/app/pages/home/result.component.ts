import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TitleAnalyzerResult } from 'src/app/models/titleAnalyzerResult';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from 'src/app/components/ui/accordion.component';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { filter, from, switchMap, tap } from 'rxjs';
import { formatStringArray } from 'src/app/utils/formatStringArray';
import { getReadabilityScoreMeaning } from 'src/app/utils/getReadabilityScoreMeaning';
import { AuthService } from 'src/app/services/auth.service';

interface AnalysesDataItem {
  heading: string;
  value: number;
  content: string;
}

@Component({
  selector: 'TitleAnalyzerResult',
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
          {{ title }}
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
        *ngFor="let data of analysesData"
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
export class ResultComponent implements OnInit {
  @Input() sideColumn? = false;
  analysesData: AnalysesDataItem[] = [];
  informationalData: { heading: string; content: string[] }[] = [];
  title = '';

  result?: TitleAnalyzerResult;
  similarProjects: string[] = [
    'Development and evaluation of Record Management System',
    'Development and evaluation of Record Management System',
    'Development and evaluation of Record Management System',
  ];

  router = inject(Router);
  projectService = inject(ProjectService);
  authService = inject(AuthService);
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.projectService.analyzerResult$
      .pipe(
        filter((v): v is TitleAnalyzerResult => v !== undefined),
        tap((data) => (this.title = data.title)),
        switchMap((v) => this.prepareAnalysesData(v))
      )
      .subscribe({
        next: (v) => {
          this.analysesData = v;
        },
        error: () => {
          this.toastr.error('Error occured while analyzing title');
        },
        complete: () => {},
      });
  }

  handleBackButtonClick() {
    this.projectService.clearAnalyzerResult();
    this.router.navigate(['s', 'home', 'title-analyzer']);
  }

  async prepareAnalysesData(data: TitleAnalyzerResult) {
    try {
      const substantiveWordCount: AnalysesDataItem = {
        heading: 'Substantive Word Count',
        value: data.substantive_words.count,
        content: `The title comprises ${
          data.substantive_words.count
        } significant words, specifically the following: ${formatStringArray(
          data.substantive_words.words
        )}`,
      };
      const titleCount = await this.projectService.getProjectCount();
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
    } catch (err) {
      console.error('error occured:', err);
      throw new Error('error occuredasd');
    }
  }
}
