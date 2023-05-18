import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div
      class=" flex w-full flex-col gap-[1rem] sm2:w-[840px] md:w-full "
    >
      <div class="gap-2 sm1:flex-row sm1:items-center sm1:justify-between">
        <div class="w-full">
          <h1 class="text-2xl">Tasks</h1>
          <div class="h-[260px] w-full bg-neutral">some chart</div>
          <div class="h-[260px] w-full bg-neutral">some chart</div>
        </div>
      </div>
    </div>
    <!-- <div class="w-full bg-secondary">test</div> -->
  `,
})
export class DashboardComponent {
  search: string = '';
}
