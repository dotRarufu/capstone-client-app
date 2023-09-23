import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { ProjectsComponent } from './projects-container.component';

import { CommonModule } from '@angular/common';
import { SectionProject } from 'src/app/models/sectionProject';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { groupBySection } from 'src/app/utils/groupBySection';
import { ActivatedRoute } from '@angular/router';
import { HomeStateService } from './data-access/home-state.service';
import { ProjectsAccordionComponent } from './projects-accordion.component';
import { ProjectCardComponent } from './project-card.component';
import { EMPTY, catchError, map, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';

@Component({
  selector: 'adviser-projects',
  standalone: true,
  imports: [
    ProjectsComponent,
    ProjectsAccordionComponent,
    CommonModule,
    ProjectCardComponent,
    FeatherIconsModule,
  ],
  template: `
    <div
      class="w-full"
      *ngIf="{
        sections: sections$ | async,
        archived: archived$ | async
      } as observables"
    >
      <projects
        *ngIf="
          observables.sections !== null && observables.sections.length !== 0;
          else empty
        "
      >
        <projects-accordion
          *ngFor="let section of observables.sections"
          [heading]="section.section.toString()"
        >
        
            <ProjectCard
              (removeProjectId)="
                this.homeStateService.setActiveProjectId($event)
              "
              *ngFor="let project of section.projects"
              [project]="project"
              [role]="role"
            />
        
        </projects-accordion>

        <projects-accordion
          *ngIf="
            observables.archived !== null &&
            observables.archived !== undefined &&
            observables.archived.length > 0
          "
          heading="Archived"
        >
          <ProjectCard
            *ngFor="let project of observables.archived"
            [project]="project"
            [role]="role"
          />
        </projects-accordion>
      </projects>

      <ng-template #empty>
        <div
          class=" flex flex-col items-center justify-center gap-[8px]
        text-base-content/50"
        >
          <i-feather name="calendar" class="" />
          <span class="text-base">You have no assigned projects</span>
        </div>
      </ng-template>
    </div>
  `,
})
export class AdviserProjectsComponent {
  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);
  route = inject(ActivatedRoute);
  homeStateService = inject(HomeStateService);
  toastr = inject(ToastrService);

  showSpinner = this.spinner.show();

  sections$ = this.projectService.getProjects().pipe(
    tap((p) => {
      // initial emit
      if (p === null) return;
      this.spinner.hide();
    }),
    map((projects) => {
      if (projects === null) return [];

      return groupBySection(projects);
    })
  );

  archived$ = this.projectService.getArchived();

  // todo: remove this
  role = this.route.snapshot.data['role'];
}
