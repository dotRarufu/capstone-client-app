import { Component, Input } from '@angular/core';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, } from 'chart.js';

@Component({
  selector: 'Reports',
  template: `
    <ng-container *ngIf="!sideColumn">
    <div class="flex h-full flex-col gap-[16px]">
      <div class="flex justify-between ">
        <h1 class="text-[24px] text-base-content sm2:text-[32px]">Reports</h1>
        <!-- <label
          for="schedule-consultation"
          class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
        >
          <i-feather class="text-base-content/70"name="plus"></i-feather>

          button
        </label> -->
      </div>

<!-- todo: replace other dividers with this -->
      <div class="h-[2px] w-full bg-base-content/10"></div>

      <div
        class="flex flex-col items-center gap-4 sm2:grid sm2:grid-flow-col sm2:grid-rows-3 sm2:place-content-center   sm2:items-start "
      >
        <div
          class=" min-w-[229px] min-h-[329px] h-full w-full max-w-[429px] rounded-[3px] border border-base-content/50"
        >
          <div class="bg-primary p-4 text-primary-content">
            <h1 class="text-[20px] ">Tasks by Status</h1>
          </div>

          <div class="flex justify-center p-4 h-full w-full">
            <canvas
              baseChart
              class="h-full w-full"
              [options]="barChartOptions"
              [data]="taskByStatus"
              [plugins]="barChartPlugins"
              type="bar"
            >
            </canvas>
          </div>
        </div>

        <div
          class="min-w-[229px] min-h-[329px] h-full row-span-2 flex w-full max-w-[429px] flex-col justify-center rounded-[3px] border border-base-content/50"
        >
          <div class="bg-primary p-4 text-primary-content">
            <h1 class="text-[20px] ">Accomplished Milestones</h1>
          </div>
          <div class="w-full h-full flex justify-center p-4">
            <canvas
              baseChart
              class="h-full w-full"
              [data]="accomplishedMilestones"
              type="pie"
              [options]="pieChartOptions"
              [plugins]="pieChartPlugins"
            >
            </canvas>
          </div>
        </div>

        <div
          class="row-span-2 flex h-full w-full max-w-[429px] flex-col justify-start rounded-[3px] border border-base-content/50"
        >
          <div class="bg-primary p-4 text-primary-content">
            <h1 class="text-[20px] ">Total Task Assignment</h1>
          </div>
          <div class="flex flex-col gap-4 p-4 w-full h-full">
            <canvas
              baseChart
              class=" w-full"
              [data]="totalTaskAssigmentData"
              type="pie"
              [options]="pieChartOptions"
              [plugins]="pieChartPlugins"
            >
            </canvas>
            <p class="text-base text-base-content/70">
              The display value of a grid item is blockified: if the specified
              display of an in-flow child of an element generating a grid
              container is an inline-level value, it computes to its block-level
              equivalent
            </p>
          </div>
        </div>

        <div
          class="min-w-[229px] min-h-[329px] h-full w-full max-w-[429px] rounded-[3px] border border-base-content/50"
        >
          <div class="bg-primary p-4 text-primary-content ">
            <h1 class="text-[20px] ">Tasks by Status 2</h1>
          </div>
          <div class="flex justify-center p-4 h-full w-full">
            <canvas
              baseChart
              class=" w-full h-full"
              [options]="barChartOptions"
              [data]="taskByStatus"
              [plugins]="barChartPlugins"
              type="bar"
            >
            </canvas>
          </div>
        </div>
      </div>
    </div>
    </ng-container>

    <ng-container *ngIf="sideColumn">
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex justify-between ">
        <h1 class="text-[32px] text-base-content ">Reports</h1>
        <!-- <label
          for="schedule-consultation"
          class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
        >
          <i-feather class="text-base-content/70"name="plus"></i-feather>

          button
        </label> -->
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <div
        class="flex flex-col items-center gap-4  "
      >
        <div
          class=" h-fit w-full max-w-[429px] rounded-[3px] border border-base-content/50"
        >
          <div class="bg-primary p-4 text-primary-content">
            <h1 class="text-[20px] ">Tasks by Status</h1>
          </div>
          <div class="flex justify-center p-4">
            <canvas
              baseChart
              class=" w-full"
              [options]="barChartOptions"
              [data]="taskByStatus"
              [plugins]="barChartPlugins"
              type="bar"
            >
            </canvas>
          </div>
        </div>

        <div
          class="row-span-2 flex w-full max-w-[429px] flex-col justify-center rounded-[3px] border border-base-content/50"
        >
          <div class="bg-primary p-4 text-primary-content">
            <h1 class="text-[20px] ">Accomplished Milestones</h1>
          </div>
          <div class="flex justify-center p-4">
            <canvas
              baseChart
              class=" w-full"
              [data]="accomplishedMilestones"
              type="pie"
              [options]="pieChartOptions"
              [plugins]="pieChartPlugins"
            >
            </canvas>
          </div>
        </div>

        <div
          class=" row-span-2 flex h-full w-full max-w-[429px] flex-col justify-start rounded-[3px] border border-base-content/50"
        >
          <div class="bg-primary p-4 text-primary-content">
            <h1 class="text-[20px] ">Total Task Assignment</h1>
          </div>
          <div class="flex flex-col gap-4 p-4">
            <canvas
              baseChart
              class=" w-full"
              [data]="totalTaskAssigmentData"
              type="pie"
              [options]="pieChartOptions"
              [plugins]="pieChartPlugins"
            >
            </canvas>
            <p class="text-base text-base-content/70">
              The display value of a grid item is blockified: if the specified
              display of an in-flow child of an element generating a grid
              container is an inline-level value, it computes to its block-level
              equivalent
            </p>
          </div>
        </div>

        <div
          class=" h-fit w-full max-w-[429px] rounded-[3px] border border-base-content/50"
        >
          <div class="bg-primary p-4 text-primary-content">
            <h1 class="text-[20px] ">Tasks by Status 2</h1>
          </div>
          <div class="flex justify-center p-4">
            <canvas
              baseChart
              class=" w-full"
              [options]="barChartOptions"
              [data]="taskByStatus"
              [plugins]="barChartPlugins"
              type="bar"
            >
            </canvas>
          </div>
        </div>
      </div>
    </div>
    </ng-container>
  `,
})
export class ReportsComponent {
  taskByStatus: ChartConfiguration<'bar'>['data'] = {
    labels: ['To Do', 'Done', 'Doing'],
    datasets: [
      {
        data: [1, 4, 2],
        label: 'Tasks',
        borderRadius: 3,
        backgroundColor: '#3127b4',
      },
      // { data: [ 3, 1, 2], label: 'Series B', borderRadius: 3, backgroundColor: '#0b874b' }
    ],
  };
  accomplishedMilestones: ChartData<'pie', number[], string | string[]> = {
    labels: ['Achieved', 'Unaccomplished'],
    datasets: [
      {
        data: [3, 5],
        backgroundColor: ['#0b874b', '#3127b4'],
      },
    ],
  };
  totalTaskAssigmentData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Technical Adviser', 'Subject Adviser'],
    datasets: [
      {
        data: [23, 50],
        backgroundColor: ['#0b874b', '#3127b4'],
      },
    ],
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  barChartPlugins = [DataLabelsPlugin];
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        // display: true',
      },
      datalabels: {
        color: '#C9C5FF',
      },
    },
  };
  pieChartPlugins = [DataLabelsPlugin];
  @Input() sideColumn = false;

}
