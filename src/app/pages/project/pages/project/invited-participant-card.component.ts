import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { User } from 'src/app/types/collection';
import getRoleName from 'src/app/utils/getRoleName';

@Component({
  selector: 'invited-participant-card',
  standalone: true,
  imports: [FeatherModule, CommonModule],
  template: `
    <div
      onclick="invitedParticipantDetail.showModal()"
      class="flex w-full cursor-pointer items-center justify-between rounded-[3px] hover:bg-base-200"
    >
      <div class="flex items-center gap-2 p-[8px]">
        <div
          class=" avatar  flex aspect-square items-center rounded-[5px] bg-blue-300 p-0"
        >
          <span class="w-11 text-center text-xl">K</span>
        </div>

        <div class="flex w-full flex-col">
          <a
            class=" w-fit p-0 text-base font-normal capitalize text-base-content no-underline sm1:text-[18px]"
          >
            {{ user.name }}
          </a>
          <p class="text-base text-base-content/70">{{ getRoleName(user.role)}} (Pending)</p>

        </div>
      </div>
    </div>
  `,
})
export class InvitedParticipantCardComponent {
  @Input() user: User & {
    created_at: string;
    id: number;
    is_accepted: boolean;
    project_id: number;
    receiver_uid: string;
    role: number;
    sender_uid: string;
}= {
    name: '',
    role_id: -1,
    uid: '',
    avatar_last_update: 0,
    created_at: '',
    id: -1,
    is_accepted: false,
    project_id: -1,
    receiver_uid: '',
    role: -1,
    sender_uid: ''
  };

  getRoleName(id: number) {
    return getRoleName(id)
  }
}
