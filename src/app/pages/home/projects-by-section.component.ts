import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { Observable, filter, map, tap } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { isNotNull } from 'src/app/utils/isNotNull';

@Component({
  selector: 'projects-by-section-report',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
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
          [data]="(data$ | async)!"
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
  data$: Observable<ChartConfiguration<'bar'>['data']> = this.projectService
    .getProjects()
    .pipe(
      filter(isNotNull),
      map((projects) => projects.filter((p) => !p.isDone)),
      map((undoneProjects) => {
        const sections = new Set<string>();
        undoneProjects.forEach((p) => sections.add(p.sectionName));

        const counts = new Array([...sections].length).fill(0);
        undoneProjects.forEach((p) => {
          const index = [...sections].findIndex((c) => c === p.sectionName);

          if (index !== -1) {
            counts[index] += 1;
          }
        });

        return { sections, counts };
      }),
      map(({ counts, sections }) => ({
        labels: [...sections],
        datasets: [
          {
            label: 'Projects',
            data: counts,
            backgroundColor: ['#0b874b', '#3127b4'],
          },
        ],
      })),
      tap((_) => this.chart?.update())
    );

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      datalabels: { color: '#dad0f1', font: { size: 15, weight: 'bold' } },
    },
  };
  barChartPlugins = [DataLabelsPlugin];
}
