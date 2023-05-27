import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-capstone-adviser-project-card',
  template: `
    <div
      class="border border-base-content/50 card-compact card h-fit max-w-[262px] rounded-[4px] bg-base-100 shadow-md"
    >
      <figure class="h-[92px] bg-secondary">
        <h2  (click)="handleCardClick()" class="link-hover link card-title  w-full px-4 text-left text-secondary-content">
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
            (click)="removeProjectCard()"
            class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
          >
            <i-feather name="trash"></i-feather>
          </button>
          <button
          (click)="handleCardClick()"
            class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
          >
            <i-feather name="log-in"></i-feather>
          </button>
        </div>
      </div>
    </div>
  `,
})
// todo: fix the background of login at laptop breakpoint
export class ProjectCardComponent {
  @Input() navigateTo?: Function;

  handleCardClick() {
    if (!this.navigateTo) throw Error("wip, navigateTo was not passed a value")

    this.navigateTo();
  }

  removeProjectCard() {
    console.log('delete capstone card');
  }
}
