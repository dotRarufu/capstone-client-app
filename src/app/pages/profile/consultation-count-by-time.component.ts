import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { filter, from, map, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import dateToEpoch from 'src/app/utils/dateToEpoch';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import { isNotNull } from 'src/app/utils/isNotNull';
import { months } from 'src/app/utils/months';

@Component({
  selector: 'consultation-count-by-time',
  standalone: true,
  imports: [NgChartsModule],
  template: `
    <div class=" h-full w-full rounded-[3px] border border-base-content/50 ">
      <div class="bg-primary p-4 text-primary-content">
        <h1 class="text-[20px]">Created Consultation x Time</h1>
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
export class ConsultationCountByTimeReportComponent implements OnInit {
  taskService = inject(TaskService);
  consultationService = inject(ConsultationService);
  authService = inject(AuthService);
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  data: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', '7/7', '7/14'],
    datasets: [
      {
        data: [1, 4, 2, 12, 3, 10],
        label: 'Consultation',
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

  ngOnInit() {
    this.authService
      .getAuthenticatedUser()
      .pipe(
        filter(isNotNull),
        switchMap((user) => this.consultationService.getConsultationsOrganizedBy(user.uid))
      )
      .subscribe({
        next: (consultations) => {
          // todo: only fetch 6 month before current
          // todo: order the months
          const labels = new Set<string>();
          consultations.forEach((p) => {
            const createdAt =  dateToEpoch(new Date(p.created_at));
            const seconds = createdAt * 1000;
            const date = new Date(seconds);

            labels.add(months[date.getUTCMonth()]);
          });

          const sortedConsultations = new Array([...labels].length).fill(0);

          consultations.forEach((p) => {
            const createdAt =  dateToEpoch(new Date(p.created_at));
            const seconds = createdAt * 1000;
            const date = new Date(seconds);

            const index = [...labels].indexOf(months[date.getUTCMonth()]);

            sortedConsultations[index] += 1;

            return sortedConsultations[date.getUTCMonth()];
          });
          this.data.labels = [...labels];
          this.data.datasets[0].data = sortedConsultations;
          this.chart?.update();
        },
      });
  }
}
