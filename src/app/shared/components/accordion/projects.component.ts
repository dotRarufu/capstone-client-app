import { Component, Input } from '@angular/core';

@Component({
  selector: 'ProjectsAccordion',
  template: `
    <div
      class=" collapse w-full"
      [class.collapse-arrow]="withArrow"
      [class.collapse-open]="forcedOpen"
    >
      <input type="checkbox" class="peer " />
      <div
        [class.text-center]="isHeadingCentered"
        class="collapse-title border border-base-content/50 bg-primary/10 p-[1rem] text-[20px] "
      >
        {{ heading }}
      </div>
      <div
        class="collapse-content  border border-base-content/50 text-base-content"
      >
        <div
          class="grid grid-flow-row grid-cols-1 items-center justify-items-center gap-[24px]  py-[1rem] sm1:grid-cols-2 sm1:justify-start sm2:grid-cols-3 md:grid-cols-2 md:justify-center"
        >
          <!-- <div class="py-[1rem] border-2 border-red-500  w-full"> -->

          <ng-content />
        </div>
        <!-- </div> -->
      </div>
    </div>
  `,
})
export class ProjectsAccordionComponent {
  @Input() heading: string = '';
  @Input() withArrow?: boolean = true;
  @Input() forcedOpen?: boolean = false;
  @Input() isHeadingCentered?: boolean = false;
}
