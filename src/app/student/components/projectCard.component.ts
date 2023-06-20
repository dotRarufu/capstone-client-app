import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'StudentProjectCard',
  template: `
    <div
      class="h-[300px] w-[262px] rounded-[4px] border border-neutral/50 bg-base-100 drop-shadow"
    >
      <h2
        (click)="handleCardClick()"
        class="link-hover link flex h-[92px] w-full flex-col justify-center bg-secondary p-[1rem] text-[20px] font-bold text-secondary-content"
      >
        {{ project.name }}
      </h2>

      <div
        class="h-[106px] w-full gap-[8px]  p-[1rem] text-base text-base-content"
      >
        <p class="line-clamp-3 h-full text-base">
          {{ project.title }}
        </p>
      </div>
      <div class="h-[48px] w-full line-clamp-2 px-[1rem] text-base">
        {{ project.members }}
      </div>

      <div class="flex w-full justify-end px-[1rem] text-base ">
        <button
          (click)="handleCardClick()"
          class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
        >
          <i-feather class="text-base-content/70" name="log-in" />
        </button>
        <button
          (click)="removeProject()"
          onclick="removeProjectModal.showModal()"
          class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
        >
          <i-feather class="text-base-content/70" name="trash" />
        </button>
      </div>
    </div>
  `,
})
// roles differes in action buttons
export class ProjectCardComponent implements OnInit {
  @Input() project: Project = {
    title: '',
    members: [],
    name: 'default',
    id: -1,
    sectionName: '',
  };
  @Output() removeProjectId = new EventEmitter<number>();


  constructor(private router: Router, private projectService: ProjectService) {
    // console.info(this.project);
  }

  ngOnInit(): void {
    this.project = {
      ...this.project,
      members: this.project.members.map((s) => ' ' + s),
    };
  }

  handleCardClick() {
    this.router.navigate(['s', 'project', this.project.id]);
    this.projectService.activeProjectIdSignal.set(this.project.id);
  }

  removeProject() {
    this.removeProjectId.emit(this.project.id);
  }
}
