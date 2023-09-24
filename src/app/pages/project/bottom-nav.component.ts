import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { FeatherIconsModule } from '../../components/icons/feather-icons.module';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { filter, map, merge, mergeMap, of, tap } from 'rxjs';

@Component({
  selector: 'bottom-nav',
  standalone: true,
  imports: [FeatherIconsModule, RouterModule, CommonModule],
  template: `
    <div
      class="btm-nav relative"
      *ngIf="{
        user: user$ | async,
        activeRoute: activeRoute$ | async
      } as observables"
      [ngClass]="
        observables.user?.role_id === 5
          ? 'bg-[#463dbc] text-secondary-content'
          : 'bg-primary text-primary-content'
      "
    >
      <button
        [routerLink]="['tasks']"
        [routerLinkActive]="
          (observables.user?.role_id === 5
            ? 'bg-[#463dbc] text-secondary-content'
            : 'bg-primary text-primary-content') +
          ' active text-opacity-100 border-primary'
        "
      >
        <i-feather name="trello" />
        <span *ngIf="observables.activeRoute === 'tasks'">Tasks</span>
      </button>
      <button
        [routerLink]="['consultations']"
        [routerLinkActive]="
          (observables.user?.role_id === 5
            ? 'bg-[#463dbc] text-secondary-content'
            : 'bg-primary text-primary-content') +
          ' active text-opacity-100 border-primary'
        "
      >
        <i-feather name="clipboard" />

        <span *ngIf="observables.activeRoute === 'consultations'"
          >Consultations</span
        >
      </button>
      <button
        [routerLink]="['milestones']"
        [routerLinkActive]="
          (observables.user?.role_id === 5
            ? 'bg-[#463dbc] text-secondary-content'
            : 'bg-primary text-primary-content') +
          ' active text-opacity-100 border-primary'
        "
      >
        <i-feather name="share-2" />

        <span *ngIf="observables.activeRoute === 'milestones'">Milestones</span>
      </button>
    </div>
  `,
})
export class BottomNavComponent {
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  activeRoute$ = merge(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.route),
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      map((route) => route.snapshot.url[0].path),
     
    ),
    of(
      this.route.snapshot.children[0].url.length > 0
        ? this.route.snapshot.children[0].url[0].path
        : ''
    )
  );

  user$ = this.authService.getAuthenticatedUser();
}
