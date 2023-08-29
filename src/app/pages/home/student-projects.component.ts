import { ProjectsComponent } from './projects-container.component';
import { Component, WritableSignal, inject, signal } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { HomeStateService } from './data-access/home-state.service';
import { ProjectCardComponent } from './project-card.component';
import { map, tap } from 'rxjs';

@Component({
  selector: 'student-projects',
  standalone: true,
  imports: [ProjectsComponent, ProjectCardComponent, CommonModule],
  template: ` <div
    class="w-full sm2:w-[840px] md:w-[294px]  md:flex-shrink-0 md:basis-[294px] lg:w-[1040px]"
  >
    <projects [showAdd]="true">
      <div
        class="grid grid-flow-row grid-cols-1 items-center justify-items-center gap-[24px]  sm1:grid-cols-2 sm1:justify-start sm2:grid-cols-3 md:flex md:flex-col md:items-center md:justify-center"
      >
        <ProjectCard
          (removeProjectId)="homeStateService.setActiveProjectId($event)"
          *ngFor="let project of projects$ | async"
          [project]="project"
          [role]="'s'"
        />
      </div>
    </projects>
  </div>`,
})
export class StudentProjectsComponent {
  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);
  homeStateService = inject(HomeStateService);

  projects$ = this.projectService.getProjects().pipe(
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

      return projects;
    })
  );
}
