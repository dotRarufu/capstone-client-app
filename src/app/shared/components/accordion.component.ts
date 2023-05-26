import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-shared-accordion',
  template: `
    <div [class.collapse-arrow]="withArrow"
      [class.collapse-open]="forcedOpen"
    class=" collapse w-full ">
      <input type="checkbox" class="peer " />
      <div
      [class.text-center]="isHeadingCentered"
        class="collapse-title border border-base-content/50 bg-primary/10 p-[1rem] text-[20px] "
      >
        <span *ngIf="isResult" class="text-base-content font-bold px-1" >{{score}}</span>
        {{heading}}
      </div>
      <div
        class="collapse-content  border border-base-content/50 px-0"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
// todo: make a one dynamic accordion component under shared module
export class AccordionComponent {
  constructor(private router: Router, private projectService: ProjectService) {}

  @Input() heading: string =''
  @Input() score?: number = 0;
  @Input() isResult?: boolean = false;
  @Input() withArrow?: boolean = true;
  @Input() forcedOpen?: boolean = false;
  @Input() isHeadingCentered?: boolean = false;
 
}
