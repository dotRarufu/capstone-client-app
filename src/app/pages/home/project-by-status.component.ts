import { Component, ViewChild, inject } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'projects-by-status-report',
  standalone: true,
  imports: [NgChartsModule],
  template: `
    <div class=" h-fit w-full rounded-[3px] border border-base-content/50">
      <div class="bg-primary p-4 text-primary-content">
        <h1 class="text-[20px] ">Projects by Status</h1>
      </div>
      <div class="flex justify-center p-4">
        <canvas
          baseChart
          class=""
          [data]="data"
          type="pie"
          [options]="pieChartOptions"
          [plugins]="pieChartPlugins"
        >
        </canvas>
      </div>
    </div>
  `,
})
export class ProjectsByStatusComponent {
  projectService = inject(ProjectService);
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor() {
    // todo: refactor, make only 1 call of this, together with other chart
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        if (projects === null) return;

        const done = projects.filter((p) => p.isDone).length;
        const notDone = projects.length - done;
        console.log('tmits:', [done, notDone]);

        const newData = {
          labels: ['Done', 'Not Done'],
          datasets: [
            {
              data: [done, notDone],
              backgroundColor: ['#0b874b', '#3127b4'],
            },
          ],
        };
        this.data = newData;
        this.chart?.update();
      },
    });
  }

  data: ChartData<'pie', number[], string | string[]> = {
    labels: ['Done', 'Not Done'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#0b874b', '#3127b4'],
      },
    ],
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        // display: true',
      },
      datalabels: { color: '#dad0f1', font: { size: 15, weight: 'bold' } },
    },
  };
  pieChartPlugins = [DataLabelsPlugin];
}
