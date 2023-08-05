import { Component, Input } from '@angular/core';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';

@Component({
  selector: 'Projects',
  standalone: true,
  imports: [FeatherIconsModule],
  // no need to refactor this, adviser's projects will have search function
  // so, unless the search function is short, do not combine the two
  template: `
    <div class="flex w-full flex-col gap-[1rem]">
      <div class="flex justify-between ">
        <h1 class="text-2xl text-base-content">Projects</h1>
        <button
          onclick="addProject.showModal()"
          class="btn-ghost btn-sm gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 font-[500] text-base-content flex items-center hover:border-base-content/30"
        >
          <i-feather
            class="h-[20px] w-[20px] text-base-content/70"
            name="plus"
          />

          Add
        </button>
      </div>
      <div class="h-[2px] w-full bg-base-content/10"></div>
      <ng-content />
    </div>
  `,
})
export class ProjectsComponent {
  constructor() {}

  @Input() hideHeader = false;
}
