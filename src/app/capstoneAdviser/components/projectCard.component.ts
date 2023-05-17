import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-project-card',
  template: `
    <div
    (click)="handleCardClick()"
      class="cursor-pointer card-compact card h-fit w-full max-w-[262px] rounded-[4px] bg-base-100 shadow-xl"
    >
      <figure class="h-[92px] bg-secondary">
        <h2 class="card-title  w-full px-4 text-left text-secondary-content">
          Capstool
        </h2>
        <!-- <img
          src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          alt="Shoes"
        /> -->
      </figure>
      <div class="card-body">
        <!-- <h2 class="card-title">Shoes!</h2> -->
        <p class="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed Lorem
          ipsum dolor sit amet, consectetur adipiscing elit, sed
        </p>
        <p>Markova Tanya, Gardo Versoza, Padilla Zsa Zsa | Technical Adviser</p>
        <div class="card-actions justify-end">
          <button
            class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
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
          </button>
          <button
            class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 9V19H8V9H16ZM14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM18 7H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
// todo: fix the background of login at laptop breakpoint
export class ProjectCardComponent {
  @Input() projectUid: string = '';
  @Output() navigateToProject: EventEmitter<string> = new EventEmitter();


  handleCardClick() {
    this.navigateToProject.emit(this.projectUid)
  }
}
