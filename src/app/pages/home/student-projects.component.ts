import { ProjectsComponent } from './projects.component';
import { ProjectCardComponent } from 'src/app/components/ui/project-card.component';
import { Component, WritableSignal, inject, signal } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from 'src/app/models/project';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { HomeStateService } from './data-access/home-state.service';

@Component({
  selector: 'student-projects',
  standalone: true,
  imports: [ProjectsComponent, ProjectCardComponent, CommonModule],
  // providers: [HomeStateService],
  template: ` <div
    class="w-full sm2:w-[840px] md:w-[294px]  md:flex-shrink-0 md:basis-[294px] lg:w-[1040px]"
  >
    <Projects>
      <div
        class="grid grid-flow-row grid-cols-1 items-center justify-items-center gap-[24px]  sm1:grid-cols-2 sm1:justify-start sm2:grid-cols-3 md:flex md:flex-col md:items-center md:justify-center"
      >
        <ProjectCard
          (removeProjectId)="removeProjectId($event)"
          *ngFor="let project of projects()"
          [project]="project"
          [role]="'s'"
        />
      </div>
    </Projects>
  </div>`,
})
export class StudentProjectsComponent {
  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);
  homeStateService = inject(HomeStateService);

  projects: WritableSignal<Project[]> = signal([]);

  ngOnInit() {
    this.initializeProjects();
  }

  initializeProjects() {
    // todo: unsubscribe on destroy
    const projects$ = this.projectService.getProjects();
    const subscription = projects$.subscribe({
      next: (projects) => {
        if (projects === null) {
          this.projects.set([]);
          this.spinner.show();

          return;
        }

        this.spinner.hide();
        this.projects.set(projects);
      },
      complete: () => {},
    });

    return subscription;
  }

  removeProjectId(id: number) {
    console.log('id:', id);
    this.homeStateService.setActiveProjectId(id);
  }
}
