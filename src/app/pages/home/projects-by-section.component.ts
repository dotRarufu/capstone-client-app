import { Component, ViewChild, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'projects-by-section-report',
  standalone: true,
  imports: [NgChartsModule],
  template: `
    <div class=" h-full w-full rounded-[3px] border border-base-content/50 ">
      <div class="bg-primary p-4 text-primary-content">
        <h1 class="text-[20px] ">Projects by Section</h1>
      </div>

      <div class="flex justify-center p-4">
        <canvas
          baseChart
          class="h-full w-full"
          [options]="barChartOptions"
          [data]="data"
          [plugins]="barChartPlugins"
          type="bar"
        >
        </canvas>
      </div>
    </div>
  `,
})
export class ProjectsBySectionComponent {
  projectService = inject(ProjectService);
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  data: ChartConfiguration<'bar'>['data'] = {
    labels: ['1', '2', '3'],
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
      datalabels: { color: '#dad0f1', font: { size: 15, weight: 'bold' } },
    },
  };
  barChartPlugins = [DataLabelsPlugin];

  constructor() {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        if (projects === null) return;

        const undoneProjects = projects.filter((p) => !p.isDone);

        const sections = new Set<string>();
        undoneProjects.forEach((p) => sections.add(p.sectionName));

        const counts = new Array([...sections].length).fill(0);
        undoneProjects.forEach((p) => {
          const index = [...sections].findIndex((c) => c === p.sectionName);

          if (index !== -1) {
            counts[index] += 1;
          }
        });

        const newData = {
          labels: [...sections],
          datasets: [
            {
              label: 'Projects',
              data: counts,
              backgroundColor: ['#0b874b', '#3127b4'],
            },
          ],
        };
        this.data = newData;
        this.chart?.update();
        console.log('newData:', newData);
        console.log('counts:', counts);
      },
    });
  }
}
