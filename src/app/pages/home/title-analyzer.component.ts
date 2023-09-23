import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccordionComponent } from 'src/app/components/ui/accordion.component';
import { Project } from 'src/app/models/project';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';

@Component({
  selector: 'title-analyzer',
  standalone: true,
  imports: [FeatherIconsModule, AccordionComponent, CommonModule],
  template: `
    <div class="w-full ">
      <div class="flex w-full flex-col gap-[16px]  sm2:w-[840px] md:w-full ">
        <div class="flex flex-col gap-1">
          <div class="flex justify-between ">
            <h1 class="text-2xl text-base-content">Title Analysis</h1>
            <button
              onclick="titleAnalyzer.showModal()"
              (click)="analyzeClicked.emit()"
              class="btn-ghost btn-sm flex items-center gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 font-[500] text-base-content hover:border-base-content/30"
            >
              <i-feather
                class="h-[20px] w-[20px] text-base-content/70"
                name="zap"
              />
              <span class="uppercase"> Analyze </span>
            </button>
          </div>
          <div class="h-[2px] w-full bg-base-content/10"></div>
        </div>

        <accordion *ngFor="let content of contents" [heading]="content.heading">
          <div class=" w-full pt-[16px] text-base-content">
            {{ content.content }}
            <ng-container *ngIf="content.images && content.images.length > 0">
              <div class="flex flex-wrap gap-[8px]">
                <img
                  *ngFor="let image of content.images"
                  [src]="image"
                  class="max-h-[260px] w-full object-contain"
                />
              </div>
            </ng-container>
          </div>
        </accordion>
      </div>
    </div>
  `,
})
//   todo: create a constant file, or fetch data from database. Maybe we can create an interface to edit the constants
// todo: add ability to change renderer in docx viewer (form generator)
export class TitleAnalyzerComponent {
  contents: { heading: string; content: string; images?: string[] }[] = [
    {
      heading: 'Substantive Word Count',
      content:
        'Substantive words are counted based on their meaning and significance in a sentence. These are words that carry essential information, rather than just serving as connectors or modifiers. For instance, nouns like "cat," "house," and "book" are substantive words because they represent tangible objects. Verbs like "run," "eat," and "write" are also substantive words as they convey actions. ',
    },
    {
      heading: 'Title Uniqueness',
      content:
        'Title uniqueness is computed using Levenshtein distance, which measures the similarity between two strings by counting the minimum number of single-character edits (insertions, deletions, or substitutions) needed to transform one string into the other. In the context of titles, a lower Levenshtein distance indicates higher similarity and, therefore, lower uniqueness.',
      images: ['assets/levenshtein-distance-example.png'],
    },
    {
      heading: 'Readability',
      content:
        'Title readability is computed using the Coleman-Liau index, which measures the ease of understanding a title based on its average word length and the number of characters per 100 words. The formula is as in the image, where L is the average number of characters per 100 words, and S is the average number of sentences per 100 words. The higher the Coleman-Liau index score, the more readable the title.',
      images: [
        'assets/readability-formula.png',
        'assets/readability-scores.PNG',
      ],
    },
  ];
  @Output() analyzeClicked = new EventEmitter<void>();
}
