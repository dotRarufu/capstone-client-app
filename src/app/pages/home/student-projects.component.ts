import { ProjectsComponent } from './projects-container.component';
import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { HomeStateService } from './data-access/home-state.service';
import { ProjectCardComponent } from './project-card.component';
import { map, tap } from 'rxjs';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';

@Component({
  selector: 'student-projects',
  standalone: true,
  imports: [
    ProjectsComponent,
    ProjectCardComponent,
    CommonModule,
    FeatherIconsModule,
  ],
  template: ` 
  <ng-container
   
    *ngIf="{ projects: projects$ | async } as observables"
  >
    <projects [showAdd]="true">
      <div
        class="grid grid-flow-row grid-cols-1 items-center justify-items-center gap-[24px]  sm1:grid-cols-2 sm1:justify-start sm2:grid-cols-3 md:flex md:flex-col md:items-center md:justify-center"
        *ngIf="
          observables.projects !== null && observables.projects.length !== 0;
          else empty
        "
      >
        <ProjectCard
          (removeProjectId)="homeStateService.setActiveProjectId($event)"
          *ngFor="let project of observables.projects"
          [project]="project"
          [role]="'s'"
        />
      </div>
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
</ng-container>`,
})
export class StudentProjectsComponent implements OnInit{
  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);
  homeStateService = inject(HomeStateService);

  projects$ = this.projectService.getProjects().pipe(
    tap((p) => {
      // initial emit 
      if (p === null) return;
      this.spinner.hide();
      
    }),
    map((projects) => {
      if (projects === null) {
        return [];
      }

      return projects;
    })
  );

  ngOnInit(): void {
    this.spinner.show()
  }
}
