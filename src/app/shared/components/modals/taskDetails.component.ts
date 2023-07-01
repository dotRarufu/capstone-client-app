import { Component } from '@angular/core';

@Component({
  selector: 'TaskDetailsModal',
  template: ` 
  <Modal inputId="taskDetails">
    <div
      class="flex w-full flex-col rounded-[3px] border border-base-content/10"
    >
      <div class="flex justify-between bg-primary p-[24px]">
        <div class="flex flex-col justify-between">
          <h1 class="text-[24px] text-primary-content">
            Task title placeholder
          </h1>

          <div class="text-[12px] text-primary-content/50">
            Created at 5/1/23 by Adviser Name | Currently in Doing
          </div>
        </div>
      </div>
      <div
        class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
      >
        <div
          class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4 sm1:overflow-y-scroll"
        >
          <div class="flex items-center justify-between ">
            <h1 class="text-[20px] text-base-content">Description</h1>
          </div>

          <div class="h-[2px] w-full bg-base-content/10"></div>

          <div class="text-base text-base-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem
            ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor
            sit
          </div>
        </div>
        <ul class=" flex w-full flex-col  bg-neutral/20 py-2 sm1:w-[223px]">
          <button
            class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
          >
            <i-feather class="text-base-content/70" name="edit" />
            edit
          </button>
          <button
            class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
          >
            <i-feather class="text-base-content/70" name="user-check" />
            verify
          </button>

          <div class="h-full"></div>

          <button
            class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
          >
            <i-feather class="text-base-content/70" name="x-circle" />
            close
          </button>
        </ul>
      </div>
    </div>
  </Modal>
  `,
})
export class TaskDetailsModalComponent {}
