import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'projects-by-section-report',
  standalone: true,
  imports: [NgChartsModule],
  template: `
    <div
      class=" h-full w-full rounded-[3px] border border-base-content/50 "
    >
      <div class="bg-primary p-4 text-primary-content">
        <h1 class="text-[20px] ">Projects by Section</h1>
      </div>

      <div class="flex justify-center p-4">
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
  `,
})
export class ProjectsBySectionComponent {
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

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      datalabels: { color: '#ff0000' },
    },
  };
  barChartPlugins = [DataLabelsPlugin];
}
