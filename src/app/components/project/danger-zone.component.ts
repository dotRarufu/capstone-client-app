import { Component } from '@angular/core';

@Component({
  selector: 'danger-zone',
  standalone: true,
  template: `
    <div class="flex flex-col gap-[16px]">
      <div class="flex items-center justify-between ">
        <div class="flex flex-col gap-[4px]">
          <div class="text-base font-semibold">Delete this project</div>
          <div>
            Once you delete a project, there is no going back. Please be
            certain.
          </div>
        </div>
        <button
          class="btn-sm btn gap-2 rounded-[3px] text-error hover:btn-error"
        >
          Delete
        </button>
      </div>
      <div class="flex items-center justify-between ">
        <div class="flex flex-col gap-[4px]">
          <div class="text-base font-semibold">Leave project</div>
          <div>
            Once you leave, You can only join back when invited by the project
            members.
          </div>
        </div>
        <button
          class="btn-sm btn gap-2 rounded-[3px] text-error hover:btn-error"
        >
          Leave
        </button>
      </div>
    </div>
  `,
})
export class DangerZoneComponent {}
