import { Component, Input } from '@angular/core';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'CapstoneAdviserProjectCard',
  template: `
    <div
      class="card-compact card h-fit w-[262px] rounded-[4px] border border-base-content/50 bg-base-100 shadow-md"
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
            (click)="removeProjectCard()"
            class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
          >
            <i-feather class="text-base-content/70" name="trash" />
          </button>
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
export class ProjectCardComponent {
  @Input() navigateTo?: Function;
  @Input() project: Project = {
    title: '',
    members: [],
    name: 'default',
    uid: -1,
  };

  handleCardClick() {
    if (!this.navigateTo) throw Error('wip, navigateTo was not passed a value');

    this.navigateTo();
  }

  removeProjectCard() {
    console.log('delete capstone card');
  }
}
