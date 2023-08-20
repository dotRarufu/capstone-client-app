import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'archived-mark',
  standalone: true,
  imports: [],
  template: `
    <div
      class="absolute bottom-[32px] right-[32px] z-[99999] hidden min-[998px]:block"
    >
      <div class="alert alert-info rounded-[5px] ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="h-6 w-6 shrink-0 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>This project is in archived</span>
      </div>
    </div>

    <div class="basis-[48px] min-[998px]:hidden">
      <div class="flex h-full w-full items-center justify-center  bg-info">
        <span class="text-base text-info-content">
          This project is in archived
        </span>
      </div>
    </div>
  `,
})
export class ArchivedMarkComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
