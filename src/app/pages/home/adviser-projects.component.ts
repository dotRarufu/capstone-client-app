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
          *ngFor="let section of sections()"
          [heading]="section.section"
        >
          <ProjectCard
            (removeProjectId)="removeProjectId($event)"
            *ngFor="let project of section.projects"
            [project]="project"
            [role]="role"
          />
        </projects-accordion>

        <projects-accordion heading="Archived">
          <ProjectCard
            *ngFor="let project of archived()"
            [project]="project"
            [role]="role"
          />
        </projects-accordion>
      </projects>
    </div>
  `,
})
export class AdviserProjectsComponent implements OnInit {
  sections: WritableSignal<SectionProject[]> = signal([]);
  archived: WritableSignal<Project[]> = signal([]);

  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);
  route = inject(ActivatedRoute);
  homeStateService = inject(HomeStateService);

  role = this.route.snapshot.data['role'];

  ngOnInit() {
    this.setupArchived();
    this.setupSections();
  }

  setupArchived() {
    this.projectService.getArchived().subscribe({
      next: (projects) => {
        this.archived.set(projects);
      },
    });
  }

  setupSections() {
    const projects$ = this.projectService.getProjects();

    projects$.subscribe({
      next: (projects) => {
        if (projects === null) {
          this.sections.set([]);
          this.spinner.show();

          return;
        }
        this.spinner.hide();
        this.sections.set(groupBySection(projects));
      },
      complete: () => console.log('projects$ complete'),
      error: () => console.log('projects$ errored'),
    });
  }

  removeProjectId(id: number) {
    this.homeStateService.setActiveProjectId(id);
  }
}
