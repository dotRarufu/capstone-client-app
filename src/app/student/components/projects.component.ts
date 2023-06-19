import { Component } from '@angular/core';

@Component({
  selector: 'Projects',
  template: `
    <div class="flex w-full flex-col gap-[1rem]">
      <div class="flex justify-between ">
        <h1 class="text-[32px] text-base-content">Projects</h1>
        <label
          for="add-project"
          class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
        >
          <i-feather class="text-base-content/70" name="plus" />

          Add
        </label>
      </div>
      <div class="h-[2px] w-full bg-base-content/10"></div>
      <ng-content />
    </div>
  `,
})
export class ProjectsComponent {
  constructor() {}
}
