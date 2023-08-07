import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { TaskService } from 'src/app/services/task.service';
import { ActivatedRoute } from '@angular/router';
import { MilestoneService } from 'src/app/services/milestone.service';
import { UserService } from 'src/app/services/user.service';
import { Task } from 'src/app/types/collection';
import { from, switchMap } from 'rxjs';
import { TotalTaskAssignmentReportComponent } from './total-task-assignment-report.component';

@Component({
  selector: 'project-reports',
  standalone: true,
  imports: [NgChartsModule, CommonModule, TotalTaskAssignmentReportComponent],
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
            [data]="taskByStatus"
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
            [data]="accomplishedMilestones"
            type="pie"
            [options]="pieChartOptions"
            [plugins]="pieChartPlugins"
          >
          </canvas>
        </div>
      </div>

     <total-task-assignment-report />

      <div
        class="h-full min-h-[329px] w-full min-w-[229px] max-w-[429px] rounded-[3px] border border-base-content/50"
      >
        <div class="bg-primary p-4 text-primary-content ">
          <h1 class="text-[20px] ">Consultations by Category</h1>
        </div>
        <div class="flex h-full w-full justify-center p-4">
          <canvas
            baseChart
            class=" h-full w-full"
            [options]="barChartOptions"
            [data]="taskByStatus"
            [plugins]="barChartPlugins"
            type="bar"
          >
          </canvas>
        </div>
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
  userService = inject(UserService);

  accomplishedMilestones: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
        // backgroundColor: ['#0b874b', '#3127b4'],
      },
    ],
  };

  constructor() {
    const projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);
    // this.taskService.getTaskCountByAdviser(0, projectId).subscribe({
    //   next: (count) => {
    //     this.taskByStatus.datasets[0].data[0] = count;
    //     this.chart?.update();
    //   },
    // });
    // this.taskService.getTaskCountByAdviser(1, projectId).subscribe({
    //   next: (count) => {
    //     this.taskByStatus.datasets[0].data[1] = count;
    //     this.chart?.update();
    //   },
    // });
    // this.taskService.getTaskCountByAdviser(2, projectId).subscribe({
    //   next: (d) => {
    //     // todo: create new chart for getTaskCountByAdviser,
    //     // todo: create n ew service function for getTaskCount and totalTaskAssigned
    //     // display task count assigned by advisers
    //     // display getTaskCount and totalTaskAssigned

    //     // tech ad
    //     // doing tasks - 2
    //     // done tasks -34

    //     // getTaskByStatus

    //     this.taskByStatus.datasets[0].data[2] = d.count;
    //     this.chart?.update();
    //   },
    // });

    this.taskService.getAllTasks(projectId).subscribe({
      next: (tasks) => {
        const todo = tasks.filter((t) => t.status_id === 0);
        const doing = tasks.filter((t) => t.status_id === 1);
        const done = tasks.filter((t) => t.status_id === 2);

        this.taskByStatus.datasets[0].data[0] = todo.length;
        this.taskByStatus.datasets[0].data[1] = doing.length;
        this.taskByStatus.datasets[0].data[2] = done.length;

        this.chart?.update();
      },
    });

    this.milestoneService.getMilestones(projectId).subscribe({
      next: (v) => {
        const accomplished = v.filter((v) => v.is_achieved).length;
        const unAccomplished = v.length - accomplished;

        const newData = {
          labels: ['Achieved', 'Unaccomplished'],
          datasets: [
            {
              data: [accomplished, unAccomplished],
              backgroundColor: ['#0b874b', '#3127b4'],
            },
          ],
        };
        this.accomplishedMilestones = newData;
        this.chart?.update();
      },
      error: (err) => console.log('errs:', err),
    });
  }

  taskByStatus: ChartConfiguration<'bar'>['data'] = {
    labels: ['To Do', 'Done', 'Doing'],
    datasets: [
      {
        data: [],
        label: 'Tasks',
        borderRadius: 3,
        backgroundColor: '#3127b4',
      },
    ],
  };

  totalTaskAssigmentData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#0b874b', '#3127b4'],
      },
    ],
  };

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
