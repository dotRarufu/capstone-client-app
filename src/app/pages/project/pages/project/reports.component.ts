import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { TaskService } from 'src/app/services/task.service';
import { ActivatedRoute } from '@angular/router';
import { MilestoneService } from 'src/app/services/milestone.service';
import { Task } from 'src/app/types/collection';
import { Observable, from, map, switchMap, tap } from 'rxjs';
import { TotalTaskAssignmentReportComponent } from './total-task-assignment-report.component';
import { ConsultationByCategoryReportComponent } from './consultation-by-category-report.component';

@Component({
  selector: 'project-reports',
  standalone: true,
  imports: [
    NgChartsModule,
    CommonModule,
    TotalTaskAssignmentReportComponent,
    ConsultationByCategoryReportComponent,
  ],
  template: `
    <div class="flex flex-col items-center  gap-4">
      <div
        class=" h-full  w-full min-w-[229px] max-w-[429px] rounded-[3px] border border-base-content/50 "
      >
        <div class="bg-primary p-4 text-primary-content">
          <h1 class="text-[20px] ">Tasks by Status</h1>
        </div>

        <div class="flex justify-center p-4">
          <canvas
            baseChart
            class="h-full w-full"
            [options]="barChartOptions"
            [data]="(taskByStatus$ | async)!"
            [plugins]="barChartPlugins"
            type="bar"
          >
          </canvas>
        </div>
      </div>

      <div
        class=" h-fit w-full min-w-[229px] max-w-[429px] rounded-[3px] border border-base-content/50"
      >
        <div class="bg-primary p-4 text-primary-content">
          <h1 class="text-[20px] ">Accomplished Milestones</h1>
        </div>
        <div class="flex justify-center p-4">
          <canvas
            baseChart
            class=""
            [data]="(accomplishedMilestones$ | async)!"
            type="pie"
            [options]="pieChartOptions"
            [plugins]="pieChartPlugins"
          >
          </canvas>
        </div>
      </div>

      <total-task-assignment-report />

      <div class="w-full min-w-[229px] max-w-[429px]">
        <consultation-by-category-report />
      </div>
    </div>
  `,
})
export class ProjectReportsComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @ViewChild('#totalTaskAssignmentChart')
  totalTaskAssignmentChart?: BaseChartDirective;
  taskService = inject(TaskService);
  route = inject(ActivatedRoute);
  milestoneService = inject(MilestoneService);

  projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);

  accomplishedMilestones$: Observable<
    ChartData<'pie', number[], string | string[]>
  > = this.milestoneService.getMilestones(this.projectId).pipe(
    map((v) => {
      const accomplished = v.filter((v) => v.is_achieved).length;
      const unAccomplished = v.length - accomplished;

      return { accomplished, unAccomplished };
    }),
    map(({ accomplished, unAccomplished }) => {
      const newData = {
        labels: ['Achieved', 'Unaccomplished'],
        datasets: [
          {
            data: [accomplished, unAccomplished],
            backgroundColor: ['#0b874b', '#3127b4'],
          },
        ],
      };

      return newData;
    }),
    tap((_) => this.chart?.update())
  );

  taskByStatus$: Observable<ChartConfiguration<'bar'>['data']> =
    this.taskService.getAllTasks(this.projectId).pipe(
      map((tasks) => {
        const todo = tasks.filter((t) => t.status_id === 0);
        const ongoing = tasks.filter((t) => t.status_id === 1);
        const done = tasks.filter((t) => t.status_id === 2);

        return { todo, ongoing, done };
      }),
      tap((_) => this.chart?.update()),
      map(({ todo, ongoing, done }) => {
        const data = {
          labels: ['To Do', 'Done', 'On going'],
          datasets: [
            {
              data: [todo.length, ongoing.length, done.length],
              label: 'Tasks',
              borderRadius: 3,
              backgroundColor: '#3127b4',
            },
          ],
        };

        return data;
      })
    );

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      datalabels: { color: '#dad0f1', font: { size: 15, weight: 'bold' } },
    },
  };
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      datalabels: {
        color: '#dad0f1',
        font: { size: 15, weight: 'bold' },
      },
    },
  };

  barChartPlugins = [DataLabelsPlugin];
  pieChartPlugins = [DataLabelsPlugin];
}
