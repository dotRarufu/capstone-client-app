import { Component, Input } from '@angular/core';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { ProjectsBySectionComponent } from './projects-by-section.component';
import { ProjectsByStatusComponent } from './project-by-status.component';

@Component({
  selector: 'adviser-reports',
  standalone: true,
  imports: [
    NgChartsModule,
    CommonModule,
    ProjectsBySectionComponent,
    ProjectsByStatusComponent,
  ],
  template: `
    <ng-container *ngIf="!sideColumn">
      <!-- <div
        class="flex h-full flex-col gap-[16px] overflow-y-clip sm1:overflow-y-visible border border-red-500"
      > -->

      <div class="flex flex-col items-center  gap-4">
        <div class="w-full min-w-[229px] max-w-[429px]">
          <projects-by-section-report />
        </div>

        <div class="w-full min-w-[229px] max-w-[429px]">
          <projects-by-status-report />
        </div>
      </div>
      <!-- </div> -->
    </ng-container>

    <ng-container *ngIf="sideColumn">
      <div class="flex h-full flex-col gap-[16px] ">
        <div class="flex justify-between ">
          <h1 class="text-2xl text-base-content ">Reports</h1>
        </div>

        <div class="h-[2px] w-full bg-base-content/10"></div>

        <div class="flex flex-col items-center gap-4  ">
          <div class="w-full min-w-[229px] max-w-[429px]">
            <projects-by-section-report />
          </div>

          <div class="w-full min-w-[229px] max-w-[429px]">
            <projects-by-status-report />
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class AdviserReportsComponent {
  taskByStatus: ChartConfiguration<'bar'>['data'] = {
    labels: ['To Do', 'Done', 'Doing'],
    datasets: [
      {
        // minBarLength:
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
      datalabels: { color: '#ff0000' },
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

  // todo: should accept data to what to render

  constructor() {
    Chart.defaults.color = '#000';
  }
}
