import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { TaskService } from 'src/app/services/task.service';
import { ActivatedRoute } from '@angular/router';
import { MilestoneService } from 'src/app/services/milestone.service';
import { Task } from 'src/app/types/collection';
import { Observable, forkJoin, from, map, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'total-task-assignment-report',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  template: `
    <div
      class="row-span-2 flex w-full h-full flex-col justify-start rounded-[3px] border border-base-content/50"
    >
       <div class="bg-primary p-4 text-primary-content">
              <h1 class="text-[20px] ">Total Task Assignment</h1>
            </div>
            <div class="flex justify-center p-4">
              <canvas
                baseChart
                class=""
                [data]="(totalTaskAssigmentData$ | async)!"
                type="pie"
                [options]="pieChartOptions"
                [plugins]="pieChartPlugins"
              >
              </canvas>
            </div>
    </div>
  `,
})
export class TotalTaskAssignmentReportComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  totalTaskAssignmentChart?: BaseChartDirective;
  taskService = inject(TaskService);
  route = inject(ActivatedRoute);
  milestoneService = inject(MilestoneService);
  authService = inject(AuthService);

  projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);

  totalTaskAssigmentData$: Observable<
    ChartData<'pie', number[], string | string[]>
  > = this.taskService.getAllTasks(this.projectId).pipe(
    map((tasks) => {
      const advisers = new Set<string>();
      tasks.forEach((t) => advisers.add(t.assigner_id));

      return { advisers, tasks };
    }),
    switchMap(({ advisers, tasks }) => {
      const reqs$ = [...advisers].map((a) => this.authService.getUser(a));
      const roledAdvisers$ = forkJoin(reqs$);

      return roledAdvisers$.pipe(
        map((a) =>
          a.map((b) => {
            const role =
              b.role_id === 1 ? 'Capstone Adviser' : 'Technical Adviser';
            const count = tasks.filter((t) => t.assigner_id === b.uid).length;

            return {
              role,
              count,
            };
          })
        )
      );
    }),
    map((r) => {
      const data = {
        labels: [...r].map((a) => a.role),
        datasets: [
          {
            data: [...r].map((a) => a.count),
            backgroundColor: ['#0b874b', '#3127b4'],
          },
        ],
      };

      return data;
    }),
    tap(() => this.chart?.update())
  );

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: '#dad0f1',
        font: { size: 15, weight: 'bold' },
      },
    },
  };
  pieChartPlugins = [DataLabelsPlugin];
}
