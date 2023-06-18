import { Component, Input } from '@angular/core';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'CapstoneAdviserProjectCard',
  template: `
    <div
      class="h-[300px] w-[262px] rounded-[4px] border border-neutral/50 drop-shadow"
    >
      <h2
        (click)="handleCardClick()"
        class="link-hover link flex h-[92px] w-full flex-col justify-center bg-secondary p-[1rem] text-[20px] font-bold text-secondary-content"
      >
        {{ project.name }}
      </h2>
      <div
        class="h-[106px] w-full gap-[8px] bg-base-100 p-[1rem] text-base text-base-content"
      >
        <p class="line-clamp-3 h-full text-base">
          {{ project.title }}
        </p>
      </div>
      <div class="h-[48px] w-full px-[1rem] text-base">
        {{ project.members }} | Technical Adviser
      </div>
      <div class="flex w-full justify-end px-[1rem] text-base ">
        <button
          (click)="handleCardClick()"
          class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
        >
          <i-feather class="text-base-content/70" name="log-in" />
        </button>
        <button
          (click)="removeProjectCard()"
          class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
        >
          <i-feather class="text-base-content/70" name="trash" />
        </button>
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
    id: -1,
    sectionName: ''
  };

  handleCardClick() {
    if (!this.navigateTo) throw Error('wip, navigateTo was not passed a value');

    this.navigateTo();
  }

  removeProjectCard() {
    console.log('delete capstone card');
  }
}
