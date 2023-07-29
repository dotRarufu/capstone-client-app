import { Component } from '@angular/core';

@Component({
  selector: 'danger-zone',
  standalone: true,
  template: `
    <div class="flex flex-col gap-[16px]">
      <div class="flex justify-between items-center ">
        <div class="flex flex-col gap-[4px]">
          <div class="text-base font-semibold">          Delete this project
          </div>
          <div>
          Once you delete a repository, there is no going back. Please be certain. 

        </div>
        </div>
        <button
            class="btn-sm btn gap-2 rounded-[3px] text-error hover:btn-error"
          >
            Delete
          </button>
      </div>
    </div>
  `,
})
export class DangerZoneComponent {}
