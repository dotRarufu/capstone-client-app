import { Component, inject } from '@angular/core';
import { TitleAnalyzerComponent } from './title-analyzer.component';
import { CommonModule } from '@angular/common';
import { ResultComponent } from './result.component';
import { HomeStateService } from './data-access/home-state.service';
import { ProjectService } from '../../services/project.service';
import { tap } from 'rxjs';

@Component({
  selector: 'student-title-analyzer',
  standalone: true,
  imports: [TitleAnalyzerComponent, CommonModule, ResultComponent],
  template: `
    <div class="flex flex-col gap-4" *ngIf="{result: result$ | async} as observbles">
      <ng-container *ngIf="!observbles.result">
        <title-analyzer
          (analyzeClicked)="homeStateService.setAlreadyHaveTitle(false)"
        />
      </ng-container>

      <ng-container *ngIf="observbles.result">
        <title-analyzer-result />
      </ng-container>
    </div>
  `,
})
export class StudentTitleAnalyzerComponent {
  projectService = inject(ProjectService);
  homeStateService = inject(HomeStateService);
  result$  = this.projectService.analyzerResult$
}
