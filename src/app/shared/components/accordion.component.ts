import { Component, Input } from '@angular/core';

@Component({
  selector: 'Accordion',
  template: `
    <ng-container *ngIf="!sideColumn">
      <div class="collapse-arrow collapse w-full">
        <input type="checkbox" class="peer " />
        <div
          class="collapse-title border border-base-content/50 bg-primary/10 p-[1rem] text-[20px] "
        >
          {{ heading }}
        </div>
        <div
          class="collapse-content  border border-base-content/50 text-base-content"
        >
          <div
            class="grid grid-flow-row grid-cols-1 items-center justify-items-center gap-[24px]  py-[1rem] sm1:grid-cols-2 sm1:justify-start sm2:grid-cols-3 md:justify-center"
          >
            <ng-content select="[body]"> </ng-content>
          </div>
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="sideColumn">
      <div class="collapse-arrow collapse w-full">
        <input type="checkbox" class="peer " />
        <div
          class="collapse-title border border-base-content/50 bg-primary/10 p-[1rem] text-[20px] "
        >
          {{ heading }}
        </div>
        <div
          class="collapse-content  border border-base-content/50 text-base-content"
        >
          <div
            class="grid grid-flow-row grid-cols-2 items-center justify-items-center gap-[24px]  py-[1rem] "
          >
            <ng-content select="[body]"> </ng-content>
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
// todo: make a one dynamic accordion component under shared module
export class AccordionComponent {
  @Input() sideColumn? = false;
  @Input() heading: string = '';
  @Input() score?: number = 0;
  @Input() isResult?: boolean = false;
  @Input() withArrow?: boolean = true;
  @Input() forcedOpen?: boolean = false;
  @Input() isHeadingCentered?: boolean = false;
}
