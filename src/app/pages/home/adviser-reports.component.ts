import { Component, Input } from '@angular/core';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { ProjectsBySectionComponent } from './projects-by-section.component';
import { ProjectsByStatusComponent } from './project-by-status.component';
import { GroupsConsultationCountReportComponent } from './groups-consultation-count.component';

@Component({
  selector: 'adviser-reports',
  standalone: true,
  imports: [
    NgChartsModule,
    CommonModule,
    ProjectsBySectionComponent,
    ProjectsByStatusComponent,
    GroupsConsultationCountReportComponent
  ],
  template: `
    <div
      class="w-full sm2:flex sm2:justify-center md:flex-shrink-0  md:basis-[357px]"
    >
      <ng-container *ngIf="!sideColumn">
        <div
          class="flex w-full flex-wrap items-start justify-center gap-4  md:flex-col md:items-center"
        >
        <div class="w-full min-w-[229px] max-w-[329px]">
            <projects-by-status-report />
          </div>

          <div class="w-full min-w-[229px] max-w-[429px]">
            <projects-by-section-report />
          </div>

          <div class="w-full min-w-[229px] max-w-[429px]">
            <groups-consultation-count-report />
          </div>
        </div>
      </ng-container>

      <ng-container *ngIf="sideColumn">
        <div class="flex h-full flex-col gap-[16px] ">
          <div class="flex justify-between ">
            <h1 class="text-2xl text-base-content ">Reports</h1>
          </div>

          <div class="h-[2px] w-full bg-base-content/10"></div>

          <div
            class="flex w-full flex-wrap items-start justify-center gap-4  md:flex-col md:items-center"
          >
          <div class="w-full min-w-[229px] max-w-[329px]">
              <projects-by-status-report />
            </div>

            <div class="w-full min-w-[229px] max-w-[429px]">
              <projects-by-section-report />
            </div>


          <div class="w-full min-w-[229px] max-w-[429px]">
            <groups-consultation-count-report />
          </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
export class AdviserReportsComponent {
  taskByStatus: ChartConfiguration<'bar'>['data'] = {
    labels: ['To Do', 'Done', 'On going'],
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
