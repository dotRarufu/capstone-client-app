import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
   <div class="w-full">
            <h1 class="text-2xl">Tasks</h1>
            <div class="h-[260px] w-full bg-neutral">some chart</div>
            <div class="h-[260px] w-full bg-neutral">some chart</div>
          </div>
  `,
})
export class DashboardComponent {
  search: string = '';
}
