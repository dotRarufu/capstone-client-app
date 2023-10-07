import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Tab } from 'src/app/models/tab';
import { TabsService } from 'src/app/services/tabs.service';

@Component({
  selector: 'tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="overflow-x-clip border-b border-base-content/20 px-[1rem] py-1 sm1:px-[32px] sm2:px-0  md:border-none"
    >
      <div
        [class.md:hidden]="isResponsive"
        class="mx-auto flex w-full flex-row overflow-x-clip sm1:overflow-x-visible  "
      >
        <div
          *ngFor="let tab of tabs"
          (click)="tab.handler()"
          class="btn-link btn flex-grow font-normal text-base-content no-underline hover:no-underline"
        >
          <button
            [class.border-b-[2px]]="tab.active"
            [class.text-primary]="tab.active"
            [class.no-animation]="tab.active"
            class="mx-auto w-fit border-primary text-base capitalize   "
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TabsComponent {
  @Input() isResponsive?: boolean = true;
  tabs: Tab[] = [];

  tabsService = inject(TabsService);

  subscription = this.tabsService.tabs$.pipe(takeUntilDestroyed()).subscribe({
    next: (tabs) => {
      if (tabs !== null) this.tabs = tabs;
    },
  });
}
