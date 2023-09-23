import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { filter, from, map, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import { isNotNull } from 'src/app/utils/isNotNull';
import { months } from 'src/app/utils/months';

@Component({
  selector: 'created-consultations-by-category',
  standalone: true,
  imports: [NgChartsModule],
  template: `
    <div class=" h-full w-full rounded-[3px] border border-base-content/50 ">
      <div class="bg-primary p-4 text-primary-content">
        <h1 class="text-[20px]">Created Consultation x Category</h1>
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
export class CreatedConsultationByCategoryReportComponent implements OnInit {
  taskService = inject(TaskService);
  authService = inject(AuthService);
  consultationService = inject(ConsultationService);
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  data: ChartConfiguration<'bar'>['data'] = {
    labels: ['Pending', 'Scheduled', 'Completed', 'Declined'],
    datasets: [
      {
        // minBarLength:
        data: [1, 4, 2],
        label: 'Consultation',
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

  ngOnInit() {
    this.authService
      .getAuthenticatedUser()
      .pipe(
        filter(isNotNull),
        switchMap((user) =>
          this.consultationService.getConsultationsOrganizedBy(user.uid)
        )
      )
      .subscribe({
        next: (consultations) => {
          const pending = consultations.filter((c) => c.category_id === 0);
          const scheduled = consultations.filter((c) => c.category_id === 1);
          const completed = consultations.filter((c) => c.category_id === 2);
          const declined = consultations.filter((c) => c.category_id === 3);

          this.data.datasets[0].data[0] = pending.length;
          this.data.datasets[0].data[1] = scheduled.length;
          this.data.datasets[0].data[2] = completed.length;
          this.data.datasets[0].data[3] = declined.length;

          this.chart?.update();
        },
      });
  }
}
