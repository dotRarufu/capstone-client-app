import { Component, Input, OnInit } from '@angular/core';
import { Tab } from 'src/app/models/tab';

@Component({
  selector: 'Tabs',
  template: `
    <div
      class="border-b md:border-none border-base-content/20 px-[1rem] py-1 sm1:px-[32px] sm2:px-0 "
    >
      <div
        [class.md:hidden]="isResponsive"
        class="mx-auto flex w-full flex-row  overflow-x-scroll sm1:overflow-x-visible sm2:w-[840px] "
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
export class TabsComponent implements OnInit {
  @Input() tabs: Tab[] = [];
  active: string = '';
  @Input() isResponsive?: boolean = true;

  ngOnInit(): void {


  }
}
