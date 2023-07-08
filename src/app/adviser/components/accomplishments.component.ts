import { Component, Input } from '@angular/core';
import { Task } from 'src/app/types/collection';

@Component({
  selector: 'Accomplishments',
  template: `
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between ">
        <h1 class="text-[20px] text-base-content">Accomplishments</h1>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <ul class="flex h-fit  flex-col gap-2">
        <li
          *ngFor="let task of data"
          class="flex rounded-[3px] items-center border border-base-content/20 px-4 py-2 text-base text-base-content gap-2 "
        >
        <div class="h-[20px] w-[20px] flex">
            <i-feather
              class="text-base-content/70"
              name="check-circle"
            />
</div>
            <p class="line-clamp-1">
              {{ task.title }}
            </p>
        </li>
      </ul>
    </div>
  `,
})
export class AccomplishmentsComponent {
  @Input() data: Task[] = [];
  @Input() hideInput? = false;
}
