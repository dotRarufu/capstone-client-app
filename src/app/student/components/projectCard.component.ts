import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'StudentProjectCard',
  template: `
    <div
      class="card-compact card h-fit max-w-[262px] rounded-[4px] border border-base-content/50 bg-base-100 shadow-md"
    >
      <figure class="h-[92px] bg-secondary">
        <h2
          (click)="handleCardClick()"
          class="link-hover link card-title  w-full px-4 text-left text-secondary-content"
        >
          {{ project.name }}
        </h2>
      </figure>
      <div class="card-body">
        <p class="text-sm">
          {{ project.title }}
        </p>
        <p>{{ project.members }} | Technical Adviser</p>
        <div class="card-actions justify-end">
          <button
            (click)="handleCardClick()"
            class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
          >
            <i-feather class="text-base-content/70" name="log-in" />
          </button>
        </div>
      </div>
    </div>
  `,
})
// roles differes in action buttons
export class ProjectCardComponent {
  @Input() project: Project = {
    title: '',
    members: [],
    name: 'default',
    uid: -1,
  };

  constructor(private router: Router, private projectService: ProjectService) {
    console.info(this.project);
  }

  handleCardClick() {
    this.router.navigate(['s', 'project', this.project.uid]);
    this.projectService.activeProjectIdSignal.set(this.project.uid);
  }

  removeProjectCard() {
    console.log('delete capstone card');
  }
}
