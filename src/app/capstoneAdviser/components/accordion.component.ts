import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accordion',
  template: `
    <div class="collapse-arrow collapse w-full">
      <input type="checkbox" class="peer " />
      <div
        class="collapse-title border border-base-content/50 bg-primary/10 p-[1rem] text-[20px] "
      >
        BSIT 3-1
      </div>
      <div
        class="collapse-content  border border-base-content/50 text-base-content"
      >
        <div
          class="flex flex-wrap justify-center gap-[24px] py-[1rem] sm1:justify-start"
        >
          <app-project-card (navigateToProject)="navigateToProject($event)"></app-project-card>
          <app-project-card (navigateToProject)="navigateToProject($event)"></app-project-card>
          <app-project-card (navigateToProject)="navigateToProject($event)"></app-project-card>
        </div>
      </div>
    </div>
  `,
})
export class AccordionComponent {

  constructor(private router: Router) {

  }

  navigateToProject(uid: string) {
    this.router.navigate(['c','project', uid])
  }
}
