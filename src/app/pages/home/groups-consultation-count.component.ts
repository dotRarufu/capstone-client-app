import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { Observable, filter, forkJoin, map, of, switchMap, take, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ProjectService } from 'src/app/services/project.service';
import { isNotNull } from 'src/app/utils/isNotNull';

@Component({
  selector: 'groups-consultation-count-report',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  template: `
    <div class=" h-full w-full rounded-[3px] border border-base-content/50 ">
      <div class="bg-primary p-4 text-primary-content">
        <h1 class="text-[20px] ">Groups Consultation Count</h1>
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
export class GroupsConsultationCountReportComponent {
  projectService = inject(ProjectService);
  authService = inject(AuthService);
  consultationService = inject(ConsultationService);
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  data$: Observable<ChartConfiguration<'bar'>['data']> = this.authService
    .getAuthenticatedUser()
    .pipe(
      filter(isNotNull),
      tap(v => console.log("1:", v)),
      switchMap((u) => this.projectService.getProjects()),
      filter(isNotNull),
      tap(v => console.log("2:", v)),
    
 
  
      switchMap((projects) => {
        if (projects.length === 0) return of([]);
        console.log("projkets:", projects)
        const reqs = projects.map((p) =>
          this.consultationService
            .getConsultations(2, p.id)
            .pipe(take(1), map((consultations) => ({ project: p, consultations })))
        );

        return forkJoin(reqs);
      }),
     
      map((projectsConsultations) => {
        const projects = projectsConsultations.map((pc) => pc.project.name);
        const counts = projectsConsultations.map(
          (pc) => pc.consultations.length
        );
        console.log("projects:", projects)
        console.log("counts:", counts)

        return {
          labels: [...projects],
          datasets: [
            {
              label: 'Consultations',
              data: counts,
              backgroundColor: ['#0b874b', '#3127b4'],
            },
          ],
        };
      }),
   
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
