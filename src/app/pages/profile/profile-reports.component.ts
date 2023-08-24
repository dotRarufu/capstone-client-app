import { Component, Input } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

import { ProjectsBySectionComponent } from '../home/projects-by-section.component';
import { ProjectsByStatusComponent } from '../home/project-by-status.component';
import { TotalTasksAssignedReportComponent } from './total-task-assigned-reports.component';
import { TotalTasksByCategoryReportComponent } from './total-tasks-by-category.component';

@Component({
  selector: 'adviser-profile-reports',
  standalone: true,
  imports: [
    NgChartsModule,
    CommonModule,
    ProjectsBySectionComponent,
    ProjectsByStatusComponent,
    TotalTasksAssignedReportComponent,
    TotalTasksByCategoryReportComponent,
  ],
  template: `
    <ng-container *ngIf="!sideColumn">
      <div
        class="flex w-full flex-wrap items-start justify-center gap-4  md:flex-col md:items-center"
      >
        <div class="w-full min-w-[229px] max-w-[429px]">
          <total-tasks-assigned-report />
        </div>

        <div class="w-full min-w-[229px] max-w-[429px]">
          <total-tasks-by-category-report />
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="sideColumn">
      <div class="flex h-full flex-col gap-[16px] ">
        <div class="flex justify-between ">
          <h1 class="text-[24px] text-base-content ">Reports</h1>
        </div>

        <div class="h-[2px] w-full bg-base-content/20"></div>

        <div class="flex flex-col items-center gap-4  ">
          <div class="w-full min-w-[229px] max-w-[429px]">
            <total-tasks-assigned-report />
          </div>

          <div class="w-full min-w-[229px] max-w-[429px]">
            <total-tasks-by-category-report />
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class AdviserProfileReportsComponent {
  @Input() sideColumn = false;

  // todo: should accept data to what to render
}
