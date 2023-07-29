import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeatherIconsModule } from '../modules/feather-icons.module';

@Component({
  selector: 'bottom-nav',
  standalone: true,
  imports: [FeatherIconsModule, RouterModule],
  template: `
  <div class="btm-nav min-[998px]:hidden">
  <button
  [routerLink]="['tasks']" routerLinkActive="active text-primary "
>
  <i-feather name="trello" />
  </button>
  <button class="active"
  [routerLink]="['consultations']"  routerLinkActive="active text-primary "
  >
  <i-feather name="clipboard" />
  </button>
  <button  [routerLink]="['project']"  routerLinkActive="active text-primary "
>
  <i-feather name="sidebar" />
  </button>
</div>
  `
})
export class BottomNavComponent {

}