import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'projects-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class=" collapse w-full rounded-[4px]"
      [class.collapse-arrow]="withArrow"
      [class.collapse-open]="forcedOpen"
    >
      <input type="checkbox" class="peer " />
      <div
        [class.text-center]="isHeadingCentered"
        class="collapse-title border border-base-content/50 bg-primary/10 p-[1rem] text-base rounded-[4px]"
      >
        {{ heading }}
      </div>
      <div
        class="collapse-content  border border-base-content/50 text-base-content"
      >
        <div
          class="grid grid-flow-row grid-cols-1 items-center justify-items-center gap-[24px]  py-[1rem] sm1:grid-cols-2 sm1:justify-start sm2:grid-cols-3 md:grid-cols-1 md:justify-center min-[1340px]:grid-cols-2" 
        >
          <ng-content />
        </div>
     
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
