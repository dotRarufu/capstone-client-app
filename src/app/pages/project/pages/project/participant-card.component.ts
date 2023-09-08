import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { User } from 'src/app/types/collection';

@Component({
  selector: 'participant-card',
  standalone: true,
  imports: [FeatherModule, CommonModule],
  template: `
    <div onclick="participantDetail.showModal()" class="flex w-full items-center justify-between rounded-[3px] hover:bg-base-200 cursor-pointer">
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
          <p class="text-base text-base-content/70">{{ user.projectRole }}</p>
        </div>
      </div>

      <!-- <button
        *ngIf="showRemoveButton"
        (click)="this.removeButtonClicked.emit(this.user.uid)"
        class="btn-ghost btn-xs btn gap-2 rounded-[3px] text-[14px] font-normal text-base-content hover:text-error  "
      >
        Remove
      </button> -->
    </div>
  `,
})
export class ParticipantCardComponent {
  @Input() user: User & {projectRole: string | null} = {
    name: '',
    role_id: -1,
    uid: '',
    avatar_last_update: 0,
    projectRole: ""
  };
  @Input({ required: true }) showRemoveButton!: boolean;
  @Output() removeButtonClicked = new EventEmitter<string>();
}
