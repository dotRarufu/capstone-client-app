import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MilestoneCardComponent } from 'src/app/components/milestone/card.component';

@Component({
  selector: 'milestones',
  standalone: true,
  imports: [MilestoneCardComponent, CommonModule],
  template: `
    <div class="h-full border border-red-500 grid sm1:grid sm1:grid-cols-[auto_1fr] md:grid-cols-[1fr_3fr] gap-x-[16px]">
      <ul class="hidden sm1:flex w-full flex-col gap-[4px] overflow-y-scroll">
        <div class="border border-green-500 w-[200px]">
          Card
        </div>
      </ul>

      <div class="border border-blue-500">
          info
      </div>
    </div>
  `,
})
export class MilestonesComponent {
  data = [0,1,2];

  getOrder(index: number, length: number) {
    if (index === 0) {
      console.log('upper | index:', index);
      return 'upper';
    }
    // if (index !== 0 && index === length - 1) {
    if (index === 1) {
      console.log('lower | index:', index);
      return 'lower';
    }

    console.log('mid | index:', index);
    return 'mid';
  }
}
