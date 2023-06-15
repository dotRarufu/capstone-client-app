import { Component } from '@angular/core';

@Component({
  selector: 'TechnicalAdviserParticipants',
  template: `
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex items-center justify-between">
        <h1 class="text-[24px] text-base-content sm1:text-[32px]">
          Participants
        </h1>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <div class="flex w-full flex-col justify-center gap-2">
        <ParticipantCard />
        <ParticipantCard />
        <ParticipantCard />
      </div>
    </div>
  `,
})
export class ParticipantsComponent {}
