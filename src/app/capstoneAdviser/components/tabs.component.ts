import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabs',
  template: `
  <div class=" md:hidden">
    <div class="py-1 px-[1rem] sm1:px-[32px] sm2:px-0 border-b border-base-content/20 ">
    <div class="flex w-full flex-row  sm2:w-[840px] md:hidden mx-auto ">
      <div
      *ngFor="let tab of tabs"
      (click)="tab.handler()"
      class="btn-link btn flex-grow font-normal text-base-content no-underline hover:no-underline"
      >
        <button 
          [class.border-b-[2px]]="tab.name === active"
          [class.text-primary]="tab.name === active"
          [class.no-animation]="tab.name === active"
          class="capitalize mx-auto w-fit border-primary text-base   "
          >
          {{ tab.name }}
        </button>
      </div>
    </div>
  </div>
  </div>
  `,
})
// todo: fix the background of login at laptop breakpoint
export class TabsComponent implements OnInit{
  @Input() tabs: { name: string; handler: Function }[] = []
  active: string = '';

  constructor(private route: ActivatedRoute) {

  }


  ngOnInit(): void { 
    const lastIndex = this.route.snapshot.url.length - 1;
    this.active = this.route.snapshot.url[lastIndex].toString()
  }
}
