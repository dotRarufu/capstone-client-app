import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'milestone-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-[80px] w-full grid grid-cols-[1fr_4fr] grid-rows-3">
      <div></div>
      <div></div>

     
      <div class="border border-red-500">
        <input type="checkbox" class="h-full w-full btn btn-circle" />
      </div>
      <div class="text-[20px] font-khula align-middle ">
        Milestone Title
      </div>

      <div class="flex flex-col justify-center items-center">
        <div class="h-full w-[4px] bg-primary"></div>
      </div>
      <div></div>
    </div>

    
    <!-- <div class="border border-red-500 w-full flex">
      <div class="w-[60px] h-[80px] border border-green-500 flex flex-col items-center pt-[16px]">
        <span
          class="inline-block h-[20px] shrink-0 w-[20px] rounded-full bg-primary outline outline-1 outline-primary "
        >
        </span>
        <div class="h-full w-[4px] bg-primary"></div>
      </div>

      <div class="text-[20px] pt-[16px] border border-blue-500">
        Milestone Title
      </div>
    </div> -->
  `,
})
export class MilestoneCardComponent {
  // @Input({ required: true }) index!: 'upper' | 'mid' | 'lower';

  constructor() {
    // console.log("card | ", this.index);
  }
}


// <ng-container [ngSwitch]="index">
//       <div *ngSwitchCase="'lower'" class="flex h-full gap-[1rem]">
//         <div class="flex  h-full w-[12px] flex-col items-center px-2">
//           <!-- line -->
//           <div
//             class="w-[2px] flex-shrink-0 flex-grow basis-[10px] bg-primary"
//           ></div>
//           <!-- circle -->
//           <span
//             class="inline-block h-[12px] w-[12px] flex-shrink-0 rounded-full bg-base-100 outline outline-1 outline-base-content "
//           >
//           </span>
//           <!-- spacer -->
//           <div class="h-full  flex-shrink-0 "></div>
//         </div>
//         <div class="flex w-full flex-col gap-[8px] py-1">
//           <div class="text-base text-base-content">Title Defense</div>
//           <p class="text-[12px] text-base-content/50">
//             Development and Evaluation of Capstool: a Web-based Capstone Project
//             Development Progress Tracker with Title Analyzer for Pamantasan ng
//             Lungsod ng Valenzuela - Information Technology Department
//           </p>
//           <div class="flex w-full justify-end">
//             <div class="badge badge-sm bg-secondary">May 2023</div>
//           </div>
//         </div>

//         <div *ngSwitchCase="'mid'" class="flex gap-[1rem]">
//           <div class="flex w-[12px] flex-col items-center justify-stretch px-2">
//             <!-- line -->
//             <div
//               class="w-[2px] flex-shrink-0 flex-grow basis-[10px] bg-primary"
//             ></div>
//             <!-- circle -->
//             <span
//               class="inline-block h-[12px] w-[12px] flex-shrink-0 rounded-full bg-primary outline outline-1 outline-primary "
//             >
//             </span>
//             <!-- line -->
//             <div class="h-full w-[2px] flex-shrink-0 bg-primary"></div>
//           </div>
//           <div class="flex w-full flex-col gap-[8px] py-1">
//             <div class="text-base text-base-content">Title Defense</div>
//             <p class="text-[12px] text-base-content/50">
//               Development and Evaluation of Capstool: a Web-based Capstone
//               Project Development Progress Tracker with Title Analyzer for
//               Pamantasan ng Lungsod ng Valenzuela - Information Technology
//               Department
//             </p>
//             <div class="flex w-full justify-end">
//               <div class="badge badge-sm bg-secondary">May 2023</div>
//             </div>
//           </div>
//         </div>

//         <div
//           *ngSwitchCase="'upper'"
//           class="flex w-[12px] flex-col items-center justify-stretch px-2 pt-[10px]"
//         >
//           <!-- circle -->
//           <span
//             class="inline-block h-[12px] w-[12px] flex-shrink-0 rounded-full bg-primary outline outline-1 outline-primary "
//           >
//           </span>
//           <!-- line -->
//           <div class="h-full w-[2px] flex-shrink-0 bg-primary"></div>
//         </div>
//         <div class="flex w-full flex-col gap-[8px] py-1">
//           <div class="text-base text-base-content">Title Defense</div>
//           <p class="text-[12px] text-base-content/50">
//             Development and Evaluation of Capstool: a Web-based Capstone Project
//             Development Progress Tracker with Title Analyzer for Pamantasan ng
//             Lungsod ng Valenzuela - Information Technology Department
//           </p>
//           <div class="flex w-full justify-end">
//             <div class="badge badge-sm bg-secondary">May 2023</div>
//           </div>
//         </div>
//       </div>
//     </ng-container>