import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Tab } from 'src/app/models/tab';
import { TitleAnalyzerResult } from 'src/app/models/titleAnalyzerResult';
import { SupabaseService } from 'src/app/services/supabase.service';
import { DatabaseService } from 'src/app/services/database.service';

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
  selector: 'app-student-title-analyzer-result',
  template: `
    <div class="flex flex-col gap-[1rem]">
      <div>
        <app-top-app-bar></app-top-app-bar>
        <app-tabs [tabs]="tabs"></app-tabs>
      </div>

      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
      >
        <!-- mobile -->
        <div
          class="flex w-full flex-col  gap-[16px] sm2:hidden sm2:w-[840px] md:w-full lg:w-[1040px]"
        >
          <div class="flex justify-between ">
            <h1 class="text-[24px] text-base-content">
              {{ title }}
            </h1>
            <button
              class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
            >
              <i-feather name="zap"></i-feather>

              Save
            </button>
          </div>

          <div class="h-[2px] w-full bg-base-content/10"></div>

          <app-student-accordion
            *ngFor="let data of analysesData"
            [isResult]="true"
            [score]="data.value"
            [heading]="data.heading"
          >
            <div class="p-4 pt-[32px] text-base-content">
              {{ data.content }}
            </div>
          </app-student-accordion>

          <div
            class="flex w-full flex-shrink-0  basis-[294px] flex-col gap-[16px]"
          >
            <app-student-accordion
              *ngFor="let data of informationalData"
              [withArrow]="true"
              [forcedOpen]="false"
              [heading]="data.heading"
            >
              <div class="max-h-[340px] overflow-y-scroll pt-[16px]">
                <ul class="menu">
                  <li *ngFor="let title of data.content" class=" ">
                    <a class="">{{ title }}</a>
                  </li>
                </ul>
              </div>
            </app-student-accordion>
          </div>
        </div>

        <!-- todo: fix the one in capstone adviser, that is structured like this -->
        <!-- desktop -->
        <div
          class=" hidden w-[840px] gap-[1rem] sm2:flex md:w-full lg:w-[1040px]"
        >
          <div class="flex w-[48px] flex-grow flex-col gap-[1rem] ">
            <div class="flex justify-end gap-4 ">
              <button
                (click)="handleBackButtonClick()"
                class="btn-ghost btn hidden gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30 md:flex"
              >
                <i-feather name="arrow-left"></i-feather>

                Back
              </button>
              <button
                class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
              >
                <i-feather name="heart"></i-feather>

                Save
              </button>
            </div>

            <h1 class="text-[24px] text-base-content">
              {{ title }}
            </h1>

            <app-student-accordion
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
            </app-student-accordion>
          </div>

          <div class="flex  flex-shrink-0 basis-[294px] flex-col gap-[16px]">
            <app-student-accordion
              *ngFor="let data of informationalData"
              [withArrow]="true"
              [forcedOpen]="false"
              [heading]="data.heading"
            >
              <div class="max-h-[340px] overflow-y-scroll pt-[16px]">
                <ul class="menu">
                  <li *ngFor="let title of data.content" class=" ">
                    <a class="">{{ title }}</a>
                  </li>
                </ul>
              </div>
            </app-student-accordion>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ResultComponent implements OnInit {
  // todo: create interface
  title = '';
  analysesData: AnalysesDataItem[] = [];
  informationalData: { heading: string; content: string[] }[] = [];

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

    // do not show how the title and the past projects are similar to each other

    const categoryIds = data.category_rarity.report.map(
      (item) => item.category_id
    );
    const titles = (
      await Promise.all(
        categoryIds.map(
          async (id) => await this.databaseService.getProjectsFromCategory(id)
        )
      )
    ).flat();

    const similarProjects: InformationalDataItem = {
      heading: 'Past Projects withy Similar Category',
      content: titles,
    };

    const wordSuggestions = data.words_suggestions.suggestions.map(
      ({ original_word, suggested_word }) =>
        `${original_word} -> ${suggested_word}`
    );
    const grammarSuggestions =
      data.grammar_spelling_suggestions.suggestions.map(
        ({ original_word, suggested_word }) =>
          `${original_word} -> ${suggested_word}`
      );

    const suggestions: InformationalDataItem = {
      heading: 'Suggestions',
      content: [...grammarSuggestions, ...wordSuggestions],
    };
    //* consider disabling grammar suggestion, its still of bad quality
    this.informationalData = [similarProjects, suggestions];
    this.title = data.title;
    this.analysesData = [substantiveWordCount, titleUniqueness, readability];
  }

  tabs: Tab[] = [
    {
      name: 'Title Analyzer',
      id: 'title-analyzer',
      handler: () => {
        this.router.navigate(['s', 'home', 'title-analyzer']);

        this.tabs = this.tabs.map((tab) =>
          tab.id === 'title-analyzer'
            ? { ...tab, active: true }
            : { ...tab, active: false }
        );
      },
    },
    {
      name: 'Projects',
      id: 'projects',
      handler: () => {
        this.router.navigate(['s', 'home', 'projects']);

        this.tabs = this.tabs.map((tab) =>
          tab.id === 'projects'
            ? { ...tab, active: true }
            : { ...tab, active: false }
        );
      },
    },
  ];
  result?: TitleAnalyzerResult;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private supabaseService: SupabaseService,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    // const state = this.router.getCurrentNavigation()?.extras.state;
    const state = history.state;
    const titleAnalyzerResultState = state?.['titleAnalyzerResult'];

    if (!titleAnalyzerResultState)
      throw Error('wip, result state is undefined');

    this.prepareAnalysesData(titleAnalyzerResultState);
  }

  similarProjects: string[] = [
    'Development and evaluation of Record Management System',
    'Development and evaluation of Record Management System',
    'Development and evaluation of Record Management System',
  ];

  handleBackButtonClick() {
    this.router.navigate(['s', 'home', 'title-analyzer']);
  }
}

// todo move to utils
const formatStringArray = (strings: string[]) => {
  if (strings.length === 0) {
    return '';
  } else if (strings.length === 1) {
    return strings[0];
  } else {
    const lastWord = strings.pop();
    return `${strings.join(', ')} and ${lastWord}`;
  }
};

function getReadabilityScoreMeaning(score: number) {
  let meaning;

  switch (true) {
    case score <= 6:
      meaning = '6th grade student';
      break;
    case score === 7:
      meaning = '7th grade student';
      break;
    case score === 8:
      meaning = '8th grade student';
      break;
    case score === 9:
      meaning = 'high school freshman';
      break;
    case score === 10:
      meaning = 'high school sophomore';
      break;
    case score === 11:
      meaning = 'high school junior';
      break;
    case score === 12:
      meaning = 'high school senior';
      break;
    case score === 13:
      meaning = 'college freshman';
      break;
    case score >= 14:
      meaning = 'college sophomore';
      break;
    default:
      meaning = ' |error occured| ';
      break;
  }

  return meaning;
}
