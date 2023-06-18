import { Component, Input } from '@angular/core';
import { User } from 'src/app/types/collection';

@Component({
  selector: 'StudentParticipantCard',
  template: `
    <div
      class="w-full sm1:w-[347px] flex items-center gap-2 rounded-[3px]  "
    >
      <div class=" btn btn-square p-0">
        <!-- <div
          class="w-full rounded-square bg-neutral-focus text-neutral-content"
        > -->
          <span class="text-xl">K</span>
        <!-- </div> -->
      </div>

      <div class="flex w-full flex-col">
        <a class="no-underline font-normal capitalize btn btn-link w-fit p-0 btn-sm text-base text-base-content sm1:text-[18px] ">
          {{ user.name }}
        </a>
        <p class=" text-base text-base-content/70">role {{ user.role_id }}</p>
        <!-- <p class=" text-base text-base-content/70">{{ user.uid }}</p> -->
      </div>

      <!-- <div class="dropdown-end dropdown text-base-content">
        <label tabindex="0" class="btn-ghost btn-sm btn">
          <i-feather class="text-base-content/70" name="menu" />
        </label>
        <ul
          tabindex="0"
          class="dropdown-content menu w-52 border border-base-content/30 bg-base-100 shadow-md"
        >
          <li>
            <a class="rounded-[3px] hover:rounded-[3px] focus:rounded-[3px] "
              >Remove</a
            >
          </li>
        </ul>
      </div> -->
    </div>
  `,
})
export class ParticipantCardComponent {
  @Input() user: User = { name: '', role_id: -1, uid: '' };

  constructor() {}
}
