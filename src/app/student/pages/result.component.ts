import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Tab } from 'src/app/models/tab';

@Component({
  selector: 'app-student-title-analyzer-result',
  template: `
    <div class="flex flex-col gap-[1rem]">
      <div>
        <app-top-app-bar></app-top-app-bar>
      </div>

      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:px-0 "
      >
        <!-- mobile -->
        <div
          class="flex w-full flex-col  gap-[16px] sm2:hidden sm2:w-[840px] md:w-full lg:w-[1040px]"
        >
          <div class="flex justify-between ">
            <h1 class="text-[32px] text-base-content">
              Development and evaluation of a web-based ...
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
            *ngFor="let content of contents"
            [isResult]="content.isResult"
            [score]="content.score"
            [heading]="content.heading"
          >
            <div class="p-4 pt-[32px] text-base-content">
              {{ content.content }}
            </div>
          </app-student-accordion>

          <div
            class="flex w-full flex-shrink-0  basis-[294px] flex-col gap-[16px]"
          >
            <app-student-accordion
              [withArrow]="true"
              [forcedOpen]="false"
              [heading]="'Past Projects with Similar Category'"
            >
              <div class="pt-[16px]">
                <ul class="menu">
                  <li *ngFor="let name of similarProjects" class=" ">
                    <a class="">{{ name }}</a>
                  </li>
                </ul>
              </div>
            </app-student-accordion>
            <app-student-accordion
              [withArrow]="true"
              [forcedOpen]="false"
              [heading]="'Suggestions'"
            >
              <div class="pt-[16px] text-base">
                <ul class="menu ">
                  <li *ngFor="let name of similarProjects" class=" ">
                    <a class="">{{ name }}</a>
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
            <div class="flex justify-between ">
              <h1 class="text-[32px] text-base-content">
                Development and evaluation of a web-based ...
              </h1>
              <button
                class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
              >
                <i-feather name="zap"></i-feather>

                Save
              </button>
            </div>

            <app-student-accordion
              *ngFor="let content of contents"
              [isResult]="content.isResult"
              [score]="content.score"
              [heading]="content.heading"
            >
              <!-- todo: change all px to rem -->
              <!-- pt-[32px] is a fix -->
              <div class="p-4 pt-[32px]  text-base-content">
                {{ content.content }}
              </div>
            </app-student-accordion>
          </div>

          <div class="flex  flex-shrink-0 basis-[294px] flex-col gap-[16px]">
            <app-student-accordion
              [withArrow]="false"
              [forcedOpen]="true"
              [heading]="'Past Projects with Similar Category'"
            >
              <div class="pt-[16px] text-base">
                <ul class="menu ">
                  <li *ngFor="let name of similarProjects" class=" ">
                    <a class="">{{ name }}</a>
                  </li>
                </ul>
              </div>
            </app-student-accordion>
            <app-student-accordion
              [withArrow]="false"
              [forcedOpen]="true"
              [heading]="'Suggestions'"
            >
              <div class="pt-[16px] text-base">
                <ul class="menu ">
                  <li *ngFor="let name of similarProjects" class=" ">
                    <a class="">{{ name }}</a>
                  </li>
                </ul>
              </div>
            </app-student-accordion>
          </div>
        </div>
      </div>
    </div>
    <!-- </div> -->
  `,
})
export class ResultComponent {
  // todo: create interface
  contents: {
    heading: string;
    isResult: boolean;
    score: number;
    content: string;
  }[] = [
    {
      heading: 'Substantive Word Count',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.',
      isResult: true,
      score: 24,
    },
    {
      heading: 'Title Uniqueness',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.',
      isResult: true,
      score: 58,
    },
    {
      heading: 'Readability',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.',
      isResult: true,
      score: 14,
    },
  ];

  similarProjects: string[] = [
    'Development and evaluation of Record Management System',
    'Development and evaluation of Record Management System',
    'Development and evaluation of Record Management System',
  ];
}
