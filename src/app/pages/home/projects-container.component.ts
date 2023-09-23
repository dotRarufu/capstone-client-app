import { Component, Input } from '@angular/core';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FeatherIconsModule, CommonModule],
  selector: 'projects',
  template: `
    <div
      class="flex w-full flex-col gap-[1rem] sm2:w-[840px] md:w-full lg:w-full "
    >
      <div class="flex flex-col gap-1">
        <div
          class="flex flex-col gap-2 sm1:flex-row sm1:items-center sm1:justify-between"
        >
          <h2 class="text-2xl">Projects</h2>
          <button
            *ngIf="showAdd"
            onclick="addProject.showModal()"
            class="btn-ghost btn-sm flex items-center gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 font-[500] text-base-content hover:border-base-content/30"
          >
            <i-feather
              class="h-[20px] w-[20px] text-base-content/70"
              name="plus"
            />

            Add
          </button>
        </div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
      </div>

      <ng-content />
    </div>
  `,
})
export class ProjectsComponent {
  search: string = '';
  @Input() showAdd? = false;
}
