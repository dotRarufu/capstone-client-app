import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';

@Component({
  selector: 'project-card-preview',
  standalone: true,
  imports: [FeatherIconsModule, CommonModule],
  template: `
    <div
      class="h-[240px] w-[262px] rounded-[4px] border border-neutral/50 bg-base-100 drop-shadow"
    >
      <div
        class="link-hover link flex h-[92px] w-full flex-col justify-center bg-primary p-[1rem] text-base  font-bold text-primary-content"
      >
        <p class=" truncate">
          {{ name }}
        </p>

        <div class="flex gap-4">
          <span class="text-base text-primary-content/70 no-underline">10 </span>
          <div class="flex w-full items-center gap-2">
            <span
              class="flex items-center justify-center"
              *ngFor="let c of [1, 2, 3]"
            >
              <i-feather
                class="text-success"
                style="width: 16px; height: 16px;"
                name="check-circle"
              />
            </span>
          </div>
        </div>
      </div>
      <div
        class="h-[106px] w-full gap-[8px] p-[1rem] text-base text-base-content"
      >
        <p class="line-clamp-3 h-full text-base">
          {{ title }}
        </p>
      </div>
      <div class="line-clamp-2 h-[48px] w-full px-[1rem] text-base">...</div>
    </div>
  `,
})
export class ProjectCardPreviewComponent {
  @Input() name = '';
  @Input() title = '';
}
