import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { Observable, filter, map, tap } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { isNotNull } from 'src/app/utils/isNotNull';

@Component({
  selector: 'projects-by-status-report',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  template: `
    <div class=" h-fit w-full rounded-[3px] border border-base-content/50">
      <div class="bg-primary p-4 text-primary-content">
        <h1 class="text-[20px] ">Projects by Status</h1>
      </div>
      <div class="flex justify-center p-4">
        <canvas
          baseChart
          class=""
          [data]="(data$ | async)!"
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

  data$: Observable<ChartData<'pie', number[], string | string[]>> = this.projectService
    .getProjects()
    .pipe(
      filter(isNotNull),
      map((projects) => {
        const done = projects.filter((p) => p.isDone).length;
        const notDone = projects.length - done;

        const newData = {
          labels: ['Done', 'Not Done'],
          datasets: [
            {
              data: [done, notDone],
              backgroundColor: ['#0b874b', '#3127b4'],
            },
          ],
        };

        return newData
      }),
      tap((_) => this.chart?.update())
    );

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
