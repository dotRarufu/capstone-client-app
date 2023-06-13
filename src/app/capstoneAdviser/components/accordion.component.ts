import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'Accordion',
  template: `
    <ng-container *ngIf="!sideColumn">
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
            class="grid grid-flow-row grid-cols-1 items-center justify-items-center gap-[24px]  py-[1rem] sm1:grid-cols-2 sm1:justify-start sm2:grid-cols-3 md:justify-center"
          >
            <app-capstone-adviser-project-card
              *ngFor="let project of projects"
              [navigateTo]="navigateToProject(project.uid)"
            />
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
          BSIT 3-1
        </div>
        <div
          class="collapse-content  border border-base-content/50 text-base-content"
        >
          <div
            class="grid grid-flow-row grid-cols-2 items-center justify-items-center gap-[24px]  py-[1rem] "
          >
            <app-capstone-adviser-project-card
              *ngFor="let project of projects"
              [navigateTo]="navigateToProject(project.uid)"
            />
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class AccordionComponent {
  @Input() projects: Project[] = [];
  @Input() sideColumn? = false;

  constructor(private router: Router, private projectService: ProjectService) {}

  navigateToProject(uid: number) {
    return () => {
      this.router.navigate(['c', 'project', uid]);
      this.projectService.activeProjectIdSignal.set(uid);
    };
  }
}
