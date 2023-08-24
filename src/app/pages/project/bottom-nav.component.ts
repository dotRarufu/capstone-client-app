import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeatherIconsModule } from '../../components/icons/feather-icons.module';

@Component({
  selector: 'bottom-nav',
  standalone: true,
  imports: [FeatherIconsModule, RouterModule],
  template: `
  <div class="btm-nav relative">
  <button
  [routerLink]="['tasks']" routerLinkActive="active text-primary "
>
  <i-feather name="trello" />
  </button>
  <button
  [routerLink]="['consultations']"  routerLinkActive="active text-primary "
  >
  <i-feather name="clipboard" />
  </button>
  <button  [routerLink]="['milestones']"  routerLinkActive="active text-primary "
>
  <i-feather name="sidebar" />
  </button>
</div>
  `
})
export class BottomNavComponent {

}
