import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TitleAnalyzerResult } from 'src/app/models/titleAnalyzerResult';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { formatStringArray } from '../utils/formatStringArray';
import { getReadabilityScoreMeaning } from '../utils/getReadabilityScoreMeaning';
import { FeatherModule } from 'angular-feather';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from 'src/app/components/accordion/accordion.component';
import { TaskService } from 'src/app/services/task.service';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';

interface AnalysesDataItem {
  heading: string;
  value: number;
  content: string;
}
interface InformationalDataItem {
  heading: string;
  content: string[];
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
    <ng-container *ngIf="!sideColumn">
      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
      >
        <!-- mobile -->
        <div
          class="flex w-full flex-col  gap-[16px] sm2:hidden sm2:w-[840px] md:w-full lg:w-[1040px]"
        >
          <div class="flex justify-between gap-2">
            <h1 class="text-[24px] text-base-content">
              {{ title }}
            </h1>

            <button
              class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
            >
              <i-feather class="text-base-content/70" name="zap" />

              Save
            </button>
          </div>

          <div class="h-[2px] w-full bg-base-content/10"></div>

          <Accordion
            *ngFor="let data of analysesData"
            [isResult]="true"
            [score]="data.value"
            [heading]="data.heading"
          >
            <div class="pt-[16px] text-base-content">
              {{ data.content }}
            </div>
          </Accordion>

          <div
            class="flex w-full flex-shrink-0  basis-[294px] flex-col gap-[16px]"
          ></div>
        </div>

        <!-- desktop -->
        <div
          class=" hidden w-[840px] gap-[1rem] sm2:flex md:w-full lg:w-[1040px]"
        >
          <div class="flex w-[48px] flex-grow flex-col gap-[1rem] ">
            <div class="flex justify-end gap-4 ">
              <button
                class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
              >
                <i-feather class="text-base-content/70" name="heart" />

                Save
              </button>
            </div>

            <h1 class="text-[24px] text-base-content">
              {{ title }}
            </h1>

            <Accordion
              *ngFor="let data of analysesData"
              [isResult]="true"
              [score]="data.value"
              [heading]="data.heading"
            >
              <!-- todo: change all px to rem -->
              <!-- pt-[32px] is a fix -->
              <div class="p-4 pt-[32px]  text-base-content">
                {{ data.content }}
              </div>
            </Accordion>
          </div>

          <div
            class="flex  flex-shrink-0 basis-[294px] flex-col gap-[16px]"
          ></div>
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="sideColumn">
      <div class="flex w-full flex-col  gap-[16px] ">
        <div class="flex justify-between gap-2">
          <h1 class="text-[24px] text-base-content">
            {{ title }}
          </h1>
          <button
            (click)="handleBackButtonClick()"
            class="btn-ghost btn-sm gap-2 flex flex-row items-center font-[500] rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
          >
            <i-feather class="text-base-content/70 w-[20px] h-[20px]" name="arrow-left" />
            <span class="uppercase">
              Back
</span>
          </button>
          <!-- <button
            class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
          >
            <i-feather class="text-base-content/70" name="zap" />

            Save
          </button> -->
        </div>

        <div class="h-[2px] w-full bg-base-content/10"></div>

        <Accordion
          *ngFor="let data of analysesData"
          [isResult]="true"
          [score]="data.value"
          [heading]="data.heading"
        >
          <div class="pt-[16px] text-base-content">
            {{ data.content }}
          </div>
        </Accordion>

        <div
          class="flex w-full flex-shrink-0  basis-[294px] flex-col gap-[16px]"
        ></div>
      </div>
    </ng-container>
  `,
})
export class ResultComponent implements OnInit {
  analysesData: AnalysesDataItem[] = [];
  informationalData: { heading: string; content: string[] }[] = [];
  title = '';

  result?: TitleAnalyzerResult;
  similarProjects: string[] = [
    'Development and evaluation of Record Management System',
    'Development and evaluation of Record Management System',
    'Development and evaluation of Record Management System',
  ];
  @Input() sideColumn? = false;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private databaseService: DatabaseService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.projectService.analyzerResult$.subscribe({
      next: (v) => {
        console.log('new result');

        if (v !== undefined) this.prepareData(v);
      },
      error: (err) => {
        this.toastr.error('Error occured while analyzing title');
      },
      complete: () => {
        console.log("analyzer result completes");
      }
    });
  }

  handleBackButtonClick() {
    this.projectService.clearAnalyzerResult();
    this.router.navigate(['s', 'home', 'title-analyzer']);
  }

  async prepareData(data: TitleAnalyzerResult) {
    this.spinner.show();
    try {
      await this.prepareAnalysesData(data);

      this.title = data.title;
    } catch (err) {
      console.error('error occured:', err);
    }
    this.spinner.hide();
  }

  async prepareAnalysesData(data: TitleAnalyzerResult) {
    const substantiveWordCount: AnalysesDataItem = {
      heading: 'Substantive Word Count',
      value: data.substantive_words.count,
      content: `The title comprises ${
        data.substantive_words.count
      } significant words, specifically the following: ${formatStringArray(
        data.substantive_words.words
      )}`,
    };
    const titleCount = await this.databaseService.getProjectCount();
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

    this.analysesData = [substantiveWordCount, titleUniqueness, readability];
  }
}
