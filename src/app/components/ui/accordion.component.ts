import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="!sideColumn">
      <div
        class="rounded-[4px] collapse w-full"
        [class.collapse-arrow]="withArrow"
        [class.collapse-open]="forcedOpen"
      >
        <input type="checkbox" class="peer " />
        <div
          [class.text-center]="isHeadingCentered"
          class="collapse-title border rounded-b-none border-base-content/50 bg-primary/10 p-[1rem] text-base rounded-[4px]"
        >
          {{ heading }}
          <span *ngIf="isResult" class="px-1 font-bold text-base-content">{{
            score
          }}</span>
        </div>
        <div
          class="collapse-content rounded-[4px] rounded-t-none border border-base-content/50 text-base-content"
        >
          <div class="w-full  py-[1rem]">
            <ng-content />
          </div>
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="sideColumn">
      <div
        [class.collapse-arrow]="withArrow"
        [class.collapse-open]="forcedOpen"
        class=" collapse w-full"
      >
        <input type="checkbox" class="peer " />
        <div
          [class.text-center]="isHeadingCentered"
          class="collapse-title border border-base-content/50 bg-primary/10 p-[1rem] text-base  "
        >
          {{ heading }}
          <span *ngIf="isResult" class="px-1 font-bold text-base-content">{{
            score
          }}</span>
        </div>
        <div
          class="collapse-content  border border-base-content/50 text-base-content"
        >
          <div
            class="grid grid-flow-row grid-cols-2 items-center justify-items-center gap-[24px] py-[1rem] "
          >
            <ng-content select="[sideColumn]"> </ng-content>
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class AccordionComponent {
  @Input() sideColumn? = false;
  @Input() score?: number;
  @Input() isResult?: boolean = false;
  @Input() heading: string = '';
  @Input() withArrow?: boolean = true;
  @Input() forcedOpen?: boolean = false;
  @Input() isHeadingCentered?: boolean = false;
}
