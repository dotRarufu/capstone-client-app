import { Component, ViewChild, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { filter, forkJoin, from, map, of, switchMap } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/project';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'total-tasks-by-category-report',
  standalone: true,
  imports: [NgChartsModule],
  template: `
    <div class=" h-full w-full rounded-[3px] border border-base-content/50 ">
      <div class="bg-primary p-4 text-primary-content">
        <h1 class="text-[20px] ">All Tasks by Category </h1>
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
export class TotalTasksByCategoryReportComponent {
  projectService = inject(ProjectService);
  userService = inject(UserService);
  taskService = inject(TaskService);
  authService = inject(AuthService);
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  data: ChartConfiguration<'bar'>['data'] = {
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
      datalabels: { color: '#dad0f1', font: { size: 15, weight: 'bold' } },
    },
  };
  barChartPlugins = [DataLabelsPlugin];

  constructor() {
    from(this.authService.getAuthenticatedUser())
      .pipe(
        filter(
          (
            user
          ): user is {
            name: string;
            role_id: number;
            uid: string;
          } => !!user
        ),
        switchMap((user) => this.taskService.getAllTasksBy(user.uid))
      )
      .subscribe({
        next: (tasks) => {
          const todo = tasks.filter((t) => t.status_id === 0);
          const doing = tasks.filter((t) => t.status_id === 1);
          const done = tasks.filter((t) => t.status_id === 2);

          this.data.datasets[0].data[0] = todo.length;
          this.data.datasets[0].data[1] = doing.length;
          this.data.datasets[0].data[2] = done.length;

          this.chart?.update();
        },
      });

    // from(this.authService.getAuthenticatedUser()).pipe(
    //   filter((user): user is {
    //     name: string;
    //     role_id: number;
    //     uid: string;
    // } => !!user),
    //   switchMap(user => this.projectService.getProjectsReport(user.uid, user.role_id))
    // ).subscribe({
    //   next: (projects) => {
    //     if (projects === null) return;

    //     const undoneProjects = projects.filter((p) => !p.isDone);
    //     const advisers = new Set<string>();

    //     undoneProjects.forEach(p => advisers.add(p.))
    //   },
    // });
  }
}
