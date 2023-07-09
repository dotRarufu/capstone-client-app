import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'SideBar',
  template: `
    <div
      class="flex h-full w-[311px] flex-col gap-[16px] bg-base-100 px-[24px] py-[32px]"
    >
      <div class="w-full text-base text-base-content">
        Development and Evaluation of Capstool: a Web-based Capstone Project
        Development Progress Tracker with Title Analyzer for Pamantasan ng
        Lungsod ng Valenzuela - Information Technology Department
      </div>

      <div class="h-[1px] w-full bg-base-content/20"></div>

      <div class="flex flex-col overflow-y-scroll">
        <div class="flex  gap-[1rem]">
          <div
            class="flex justify-stretch w-[12px] flex-col items-center px-2 pt-[10px]"
          >
            <!-- circle -->
            <span
              class="inline-block h-[12px] w-[12px] flex-shrink-0 rounded-full bg-primary outline outline-1 outline-primary "
            >
            </span>
            <!-- line -->
            <div class="h-full w-[2px] flex-shrink-0 bg-primary"></div>
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

        <div class="flex gap-[1rem]">
          <div class="flex justify-stretch w-[12px] flex-col items-center px-2">
            <!-- line -->
            <div
              class="w-[2px] flex-shrink-0 flex-grow basis-[10px] bg-primary"
            ></div>
            <!-- circle -->
            <span
              class="inline-block h-[12px] w-[12px] flex-shrink-0 rounded-full bg-primary outline outline-1 outline-primary "
            >
            </span>
            <!-- line -->
            <div class="h-full w-[2px] flex-shrink-0 bg-primary"></div>
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

        <div class="flex h-full gap-[1rem]">
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
      </div>
    </div>
  `,
})
export class CapstoneAdviserSideBarComponent {}
