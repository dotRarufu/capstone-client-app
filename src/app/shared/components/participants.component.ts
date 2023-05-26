import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-participants',
  template: `
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex justify-between items-center">
        <h1 class="text-[24px] sm1:text-[32px] text-base-content">Participants</h1>
        <label
          for="add-task"
          class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
        >
          <i-feather name="plus"></i-feather>

          Add
        </label>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <div class="flex w-full flex-col justify-center gap-4">
        <div
          class="flex items-center gap-2 rounded-[3px] border border-base-content/30 bg-base-100 p-3 sm1:p-4 "
        >
          <div class="placeholder avatar">
            <div
              class="w-[40px] rounded-full bg-neutral-focus text-neutral-content sm1:w-[52px]"
            >
              <span class="text-xl sm1:text-3xl">K</span>
            </div>
          </div>

          <div class="flex w-full flex-col">
            <h1 class="text-base text-base-content sm1:text-[20px] ">
              Gardo Versoza
            </h1>
            <p class=" text-base-content/70 text-base">Role</p>
          </div>

          <div class="text-base-content">
            <i-feather name="menu"></i-feather>
          </div>
        </div>
      
      </div>
    </div>
  `,
})
export class ParticipantsComponent {}
