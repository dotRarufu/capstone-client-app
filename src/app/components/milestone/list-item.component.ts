import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'list-item',
  standalone: true,
  imports: [RouterModule],
  template: `
    <li class="step-primary step">
      <div
        [routerLink]="[title]"
        routerLinkActive="btn-active"
        class="flex w-full items-center justify-between"
      >
        <span
          class="btn-link btn px-0 text-left text-base-content no-underline"
        >
          {{ title }}
        </span>
        <div class="badge badge-primary sm1:hidden">{{ date }}</div>
      </div>
    </li>
  `,
})
export class MilestoneListItemComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) date!: string;
  @Input({ required: true }) isAchieved!: boolean;

}
