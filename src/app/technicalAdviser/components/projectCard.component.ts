import { Component, Input } from '@angular/core';

@Component({
  selector: 'TechnicalAdviserProjectCard',
  template: `
    <div
      class="card card-compact h-fit max-w-[262px] rounded-[4px] border border-base-content/50 bg-base-100 shadow-md"
    >
      <figure class="h-[92px] bg-secondary">
        <h2
          (click)="handleCardClick()"
          class="link-hover link card-title  w-full px-4 text-left text-secondary-content"
        >
          Capstool
        </h2>
      </figure>
      <div class="card-body">
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
            <i-feather class="text-base-content/70" name="trash" />
          </button>
          <button
            (click)="handleCardClick()"
            class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
          >
            <i-feather class="text-base-content/70" name="log-in" />
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProjectCardComponent {
  @Input() navigateTo?: Function;

  handleCardClick() {
    if (!this.navigateTo) throw Error('wip, navigateTo was not passed a value');

    this.navigateTo();
  }

  removeProjectCard() {
    console.log('delete capstone card');
  }
}
