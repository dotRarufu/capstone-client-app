import { Component, ViewChild, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { from, map, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';

@Component({
  selector: 'total-tasks-assigned-report',
  standalone: true,
  imports: [NgChartsModule],
  template: `
    <div class=" h-full w-full rounded-[3px] border border-base-content/50 ">
      <div class="bg-primary p-4 text-primary-content">
        <h1 class="text-[20px]">Tasks x Time</h1>
      </div>

      <div class="flex justify-center p-4">
        <canvas
          baseChart
          class="h-full w-full"
          [options]="lineChartOptions"
          [data]="data"
          [plugins]="lineChartPlugins"
          type="line"
        >
        </canvas>
      </div>
    </div>
  `,
})
export class TotalTasksAssignedReportComponent {
  taskService = inject(TaskService);
  userService = inject(UserService);
  authService = inject(AuthService);
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  data: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', '7/7', '7/14'],
    datasets: [
      {
        data: [1, 4, 2, 12, 3, 10],
        label: 'Tasks',
        backgroundColor: '#0b874b',
        borderColor: '#0b874b',
        tension: 0.1,
        fill: false,
        pointBackgroundColor: '#3127b4',
      },
      // { data: [ 3, 1, 2], label: 'Series B', borderRadius: 3, backgroundColor: '#0b874b' }
    ],
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    datasets: {
      line: {},
    },
    plugins: {
      // datalabels: { color: '#dad0f1', font: { size: 15, weight: 'bold' } },
    },
  };
  lineChartPlugins = [DataLabelsPlugin];

  constructor() {
    from(this.authService.getAuthenticatedUser())
      .pipe(
        map((user) => {
          if (user === null) throw new Error('{as');

          return user;
        }),
        switchMap((user) => this.taskService.getAllTasksBy(user.uid))
      )
      .subscribe({
        next: (p) => {
          // todo: only fetch 6 month before current
          // todo: order the months
          const labels = new Set<string>();
          p.forEach((p) => {
            const seconds = p.date_added * 1000;
            const date = new Date(seconds);
            const months = [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'November',
              'December',
            ];
            labels.add(months[date.getUTCMonth()]);
          });

          const tasks = new Array([...labels].length).fill(0);

          p.forEach((p) => {
            const seconds = p.date_added * 1000;
            const date = new Date(seconds);
            const months = [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'November',
              'December',
            ];
            const index = [...labels].indexOf(months[date.getUTCMonth()]);

            tasks[index] += 1;

            return tasks[date.getUTCMonth()];
          });
          this.data.labels = [...labels];
          this.data.datasets[0].data = tasks;
          this.chart?.update();
        },
      });
  }
}
