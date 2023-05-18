import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-nav-rail',
  template: `
    <div
      class="flex h-full w-fit flex-col items-center justify-between gap-[12px] bg-primary px-[4px] py-[24px] text-primary-content"
    >
      <button
        (click)="handleMenuClick()"
        class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px] 0"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 6.00098H21M3 12.001H21M3 18.001H21"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

      
      </button>

      <div class="flex h-fit  flex-col items-center gap-[12px]">
        <button
          class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px] "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Tasks
        </button>
        <button
          class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px] 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Dashboard
        </button>
        <button
          class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px] 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Consult
        </button>
        <button
          class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px] 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Participants
        </button>
        <button
          class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px] 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Forms
        </button>
      </div>

      <button
        class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px] 0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        Profile
      </button>
    </div>
  `,
})
export class NavigationRailComponent {
  search: string = '';
  @Output() toggleDrawer: EventEmitter<string> = new EventEmitter();

  handleMenuClick() {
    this.toggleDrawer.emit();
  }
}
