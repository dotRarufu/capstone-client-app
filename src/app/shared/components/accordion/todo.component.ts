import { Component, Input } from '@angular/core';

@Component({
  selector: 'TodoAccordion',
  template: `
    <div
      class="rounded-[4px] collapse w-full"
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
        <div class="flex justify-center">
          <ng-content />
        </div>
      </div>
    </div>
  `,
})
export class TodoAccordionComponent {
  @Input() heading: string = '';
  @Input() withArrow?: boolean = true;
  @Input() forcedOpen?: boolean = false;
  @Input() isHeadingCentered?: boolean = false;
}
