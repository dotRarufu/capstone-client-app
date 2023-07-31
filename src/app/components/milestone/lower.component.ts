import { Component } from "@angular/core";

@Component({
  selector: "mid-milestone",
  standalone: true,
  template: `
      <div class="flex h-full gap-[1rem]" #last>
      <div class="flex  h-full w-[12px] flex-col items-center px-2">
        <!-- line -->
        <div
          class="w-[2px] flex-shrink-0 flex-grow basis-[10px] bg-primary"
        ></div>
        <!-- circle -->
        <span
          class="inline-block h-[12px] w-[12px] flex-shrink-0 rounded-full bg-base-100 outline outline-1 outline-base-content "
        >
        </span>
        <!-- spacer -->
        <div class="h-full  flex-shrink-0 "></div>
      </div>
      <div class="flex w-full flex-col gap-[8px] py-1">
        <div class="text-base text-base-content">Title Defense</div>
        <p class="text-[12px] text-base-content/50">
          Development and Evaluation of Capstool: a Web-based Capstone
          Project Development Progress Tracker with Title Analyzer for
          Pamantasan ng Lungsod ng Valenzuela - Information Technology
          Department
        </p>
        <div class="flex w-full justify-end">
          <div class="badge badge-sm bg-secondary">May 2023</div>
        </div>
      </div>
    </div>
  `
})
export class LowerMilestoneComponent {

}