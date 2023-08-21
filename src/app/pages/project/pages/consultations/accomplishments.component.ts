import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';
import { Task } from 'src/app/types/collection';

@Component({
  selector: 'accomplishments',
  standalone: true,
  imports: [CommonModule, FeatherIconsModule],
  template: `
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between ">
        <h1 class="text-[20px] text-base-content">Accomplishments</h1>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <ul *ngIf="data.length !== 0; else empty" class="flex h-fit  flex-col gap-2">
        <li
          *ngFor="let task of data"
          class="flex items-center gap-2 rounded-[3px] border border-base-content/20 px-4 py-2 text-base text-base-content "
        >
          <div class="flex h-[20px] w-[20px]">
            <i-feather class="text-base-content/70" name="check-circle" />
          </div>
          <p class="line-clamp-1">
            {{ task.title }}
          </p>
        </li>
      </ul>

      <ng-template #empty>
        <div class="flex w-full items-center gap-2 py-2">
          <div class=" flex h-[20px] shrink-0 grow-0 basis-[20px]">
            <i-feather
              class="text-base-content/50"
              style="width: 20px; height: 20px;"
              name="slash"
            />
          </div>

          <p class="text-base text-base-content/50">Nothing to show</p>
        </div>
      </ng-template>
    </div>
  `,
})
export class AccomplishmentsComponent {
  @Input() data: Task[] = [];
  @Input() hideInput? = false;
}
