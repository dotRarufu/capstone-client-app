import { Component } from '@angular/core';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';

@Component({
  standalone: true,
  imports: [FeatherIconsModule],
  selector: 'Projects',
  template: `
    <div
      class="flex w-full flex-col gap-[1rem] sm2:w-[840px] md:w-full lg:w-full "
    >
      <div
        class="flex flex-col gap-2 sm1:flex-row sm1:items-center sm1:justify-between"
      >
        <h2 class="text-2xl">Projects</h2>
        <!-- <div
          class="btn-ghost btn flex justify-between  rounded-[3px] border border-base-content/50 sm1:w-[222px]"
        >
         
          <span class="font-normal normal-case"> Search project... </span>

          <i-feather class="text-base-content/70" name="search" />
        </div> -->
      </div>
      <div class="h-[2px] w-full bg-base-content/10"></div>
      <ng-content />
    </div>
  `,
})
export class ProjectsComponent {
  search: string = '';

  constructor() {}
}
