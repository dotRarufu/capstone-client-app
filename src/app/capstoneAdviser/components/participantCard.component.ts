import { Component, Input } from '@angular/core';
import { User } from 'src/app/types/collection';

@Component({
  selector: 'CapstoneAdviserParticipantCard',
  template: `
    <div
      class="flex items-center gap-2 rounded-[3px] border border-base-content/30 bg-base-100 p-3 sm1:p-4 "
    >
      <div class="placeholder avatar">
        <div
          class="w-[40px] rounded-full bg-neutral-focus text-neutral-content sm1:w-[48px]"
        >
          <span class="text-xl sm1:text-3xl">K</span>
        </div>
      </div>

      <div class="flex w-full flex-col">
        <h1 class="text-base text-base-content sm1:text-[20px] ">
          {{ user.name }}
        </h1>
        <p class=" text-base text-base-content/70">{{ user.role_id }}</p>
        <p class=" text-base text-base-content/70">{{ user.uid }}</p>
      </div>

      <div class="dropdown-end dropdown text-base-content">
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
      </div>
    </div>
  `,
})
export class ParticipantCardComponent {
  @Input() user: User = { name: '', role_id: -1, uid: '' };

  constructor() {}
}
