import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { TaskService } from 'src/app/services/task.service';
import { ActivatedRoute } from '@angular/router';
import { MilestoneService } from 'src/app/services/milestone.service';
import { Task } from 'src/app/types/collection';
import { forkJoin, from, map, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'total-task-assignment-report',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  template: `
    <div
      class="row-span-2 flex h-full w-full max-w-[429px] flex-col justify-start rounded-[3px] border border-base-content/50"
    >
      <div class="bg-primary p-4 text-primary-content">
        <h1 class="text-[20px] ">Total Task Assignment</h1>
      </div>
      <div class="flex h-full w-full flex-col gap-4 p-4">
        <canvas
          baseChart
          #totalTaskAssignmentChart
          class=" w-full"
          [data]="totalTaskAssigmentData"
          type="pie"
          [options]="pieChartOptions"
          [plugins]="pieChartPlugins"
        >
        </canvas>
        <p class="text-base text-base-content/70">
          The display value of a grid item is blockified: if the specified
          display of an in-flow child of an element generating a grid container
          is an inline-level value, it computes to its block-level equivalent
        </p>
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

  SetupTotalTaskAssigment(advisers: Set<string>, tasks: Task[]) {
    const reqs$ = [...advisers].map((a) => this.authService.getUser(a));

    const roledAdvisers$ = forkJoin(reqs$);
    const res$ = roledAdvisers$.pipe(
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

    res$.subscribe({
      next: (r) => {
        r.forEach((a) => {
          this.totalTaskAssigmentData.labels?.push(a.role);
          this.totalTaskAssigmentData.datasets[0].data.push(a.count);
        });
        this.chart?.update();
      },
    });
  }

  constructor() {
    const projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);

    this.taskService.getAllTasks(projectId).subscribe({
      next: (tasks) => {
        const advisers = new Set<string>();
        tasks.forEach((t) => advisers.add(t.assigner_id));

        this.SetupTotalTaskAssigment(advisers, tasks);
      },
    });
  }

  totalTaskAssigmentData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
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
      datalabels: {
        color: '#dad0f1',
        font: { size: 15, weight: 'bold' },
      },
    },
  };
  pieChartPlugins = [DataLabelsPlugin];
}
