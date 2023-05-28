import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-capstone-adviser-participants',
  template: `
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex items-center justify-between">
        <h1 class="text-[24px] text-base-content sm1:text-[32px]">
          Participants
        </h1>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <div class="flex w-full flex-col justify-center gap-2">
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
              Gardo Versoza
            </h1>
            <p class=" text-base text-base-content/70">Role</p>
          </div>

          <div class="dropdown-end dropdown text-base-content">
            <label tabindex="0" class="btn-ghost btn-sm btn">
              <i-feather name="menu"></i-feather>
            </label>
            <ul
              tabindex="0"
              class="dropdown-content menu w-52 border border-base-content/30 bg-base-100 shadow-md"
            >
              <li>
                <a
                  class="rounded-[3px] hover:rounded-[3px] focus:rounded-[3px] "
                  >Remove</a
                >
              </li>
            </ul>
          </div>
        </div>
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
              Gardo Versoza
            </h1>
            <p class=" text-base text-base-content/70">Role</p>
          </div>

          <div class="dropdown-end dropdown text-base-content">
            <label tabindex="0" class="btn-ghost btn-sm btn">
              <i-feather name="menu"></i-feather>
            </label>
            <ul
              tabindex="0"
              class="dropdown-content menu w-52 border border-base-content/30 bg-base-100 shadow-md"
            >
              <li>
                <a
                  class="rounded-[3px] hover:rounded-[3px] focus:rounded-[3px] "
                  >Remove</a
                >
              </li>
            </ul>
          </div>
        </div>
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
              Gardo Versoza
            </h1>
            <p class=" text-base text-base-content/70">Role</p>
          </div>

          <div class="dropdown-end dropdown text-base-content">
            <label tabindex="0" class="btn-ghost btn-sm btn">
              <i-feather name="menu"></i-feather>
            </label>
            <ul
              tabindex="0"
              class="dropdown-content menu w-52 border border-base-content/30 bg-base-100 shadow-md"
            >
              <li>
                <a
                  class="rounded-[3px] hover:rounded-[3px] focus:rounded-[3px] "
                  >Remove</a
                >
              </li>
            </ul>
          </div>
        </div>
       
      </div>
    </div>
  `,
})
export class ParticipantsComponent {}
