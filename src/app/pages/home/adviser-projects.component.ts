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
import { map, tap } from 'rxjs';

@Component({
  selector: 'adviser-projects',
  standalone: true,
  imports: [
    ProjectsComponent,
    ProjectsAccordionComponent,
    CommonModule,
    ProjectCardComponent,
  ],
  template: `
    <div class="w-full">
      <projects>
        <projects-accordion
          *ngFor="let section of sections$ | async"
          [heading]="section.section"
        >
          <ProjectCard
            (removeProjectId)="this.homeStateService.setActiveProjectId($event)"
            *ngFor="let project of section.projects"
            [project]="project"
            [role]="role"
          />
        </projects-accordion>

        <projects-accordion heading="Archived">
          <ProjectCard
            *ngFor="let project of archived$ | async"
            [project]="project"
            [role]="role"
          />
        </projects-accordion>
      </projects>
    </div>
  `,
})
export class AdviserProjectsComponent {
  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);
  route = inject(ActivatedRoute);
  homeStateService = inject(HomeStateService);

  sections$ = this.projectService.getProjects().pipe(
    tap((projects) => {
      if (projects === null) {
        this.spinner.show();
        return;
      }

      this.spinner.hide();
    }),
    map((projects) => {
      if (projects === null) {
        return [];
      }

      return groupBySection(projects);
    })
  );
  archived$ = this.projectService.getArchived();

  role = this.route.snapshot.data['role'];
}
