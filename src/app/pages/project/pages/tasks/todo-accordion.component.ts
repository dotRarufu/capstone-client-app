import { Component, Input } from '@angular/core';

@Component({
  selector: 'todo-accordion',
  standalone: true,
  imports: [],
  template: `
    <div
      class="collapse h-full w-full rounded-[4px] "
      [class.collapse-arrow]="withArrow"
      [class.collapse-open]="forcedOpen"
    >
      <input type="checkbox" class="peer " />
      <div
        [class.text-center]="isHeadingCentered"
        class="collapse-title border rounded-b-none border-base-content/50 bg-primary/10 p-[1rem] text-base rounded-[4px] "
      >
        {{ heading }}
      </div>
      <div
        class="collapse-content rounded-[4px] border rounded-t-none overflow-y-auto  border-base-content/50 text-base-content"
      >
        <div class="flex h-full justify-center ">
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
