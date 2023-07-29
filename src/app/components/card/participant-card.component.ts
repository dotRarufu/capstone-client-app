import { Component, Input } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { User } from 'src/app/types/collection';

@Component({
  selector: 'ParticipantCard',
  standalone: true,
  imports: [FeatherModule],
  template: `
    <div
      class="flex w-full items-center justify-between rounded-[3px]"
    >
      <div class="flex items-center gap-2 py-[8px]">
        <div class=" btn-square btn  bg-blue-300 p-0">
          <span class="text-xl">K</span>
        </div>

        <div class="flex w-full flex-col">
          <a
            class="btn-link btn-xs btn w-fit p-0 text-base font-normal capitalize text-base-content no-underline sm1:text-[18px]"
          >
            {{ user.name }}
          </a>
          <p class="text-base text-base-content/70">role {{ user.role_id }}</p>
        </div>
      </div>

      <button
        onclick="addParticipant.showModal()"
        class="btn-ghost btn-xs btn gap-2 rounded-[3px] text-[14px] font-normal text-base-content hover:text-error  "
      >
        Remove
      </button>
    </div>
  `,
})
export class ParticipantCardComponent {
  @Input() user: User = { name: '', role_id: -1, uid: '' };

  constructor() {}
}
