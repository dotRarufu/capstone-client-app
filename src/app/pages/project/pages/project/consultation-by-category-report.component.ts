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
import { ConsultationService } from 'src/app/services/consultation.service';

@Component({
  selector: 'consultation-by-category-report',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  template: `
    <div
      class=" h-full  w-full rounded-[3px] border border-base-content/50 "
    >
      <div class="bg-primary p-4 text-primary-content">
        <h1 class="text-[20px] ">Consultations by Category</h1>
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
  `
})
export class ConsultationByCategoryReportComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  consultationService = inject(ConsultationService);
  route = inject(ActivatedRoute);
  userService = inject(UserService);

  constructor() {
    const projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);

    this.consultationService.getAllConsultations(projectId).subscribe({
      next: (consultations) => {
        const pending = consultations.filter((c) => c.category_id === 0).length;
        const scheduled = consultations.filter(
          (c) => c.category_id === 1
        ).length;
        const completed = consultations.filter(
          (c) => c.category_id === 2
        ).length;
        const declined = consultations.filter(
          (c) => c.category_id === 3
        ).length;

        this.data.datasets[0].data = [pending, scheduled, completed, declined];
        this.chart?.update();
      },
    });
  }

  data: ChartConfiguration<'bar'>['data'] = {
    labels: ['Pending', 'Scheduled', 'Completed', 'Declined'],
    datasets: [
      {
        data: [],
        label: 'Consultations',
        borderRadius: 3,
        backgroundColor: '#3127b4',
      },
    ],
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      datalabels: { color: '#dad0f1', font: { size: 15, weight: 'bold' } },
    },
  };

  barChartPlugins = [DataLabelsPlugin];
}
