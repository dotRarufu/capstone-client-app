import { Component, inject } from '@angular/core';
import { TitleAnalyzerComponent } from './title-analyzer.component';
import { CommonModule } from '@angular/common';
import { ResultComponent } from './result.component';
import { HomeStateService } from './data-access/home-state.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'student-title-analyzer',
  standalone: true,
  providers: [HomeStateService],
  imports: [TitleAnalyzerComponent, CommonModule, ResultComponent],
  template: `
    <div class="flex flex-col gap-4 ">
      <ng-container *ngIf="!(projectService.analyzerResult$ | async)">
        <title-analyzer (analyzeClicked)="handleAnalyzeClicked()" />
      </ng-container>

      <ng-container *ngIf="projectService.analyzerResult$ | async">
        <TitleAnalyzerResult />
      </ng-container>
    </div>
  `,
})
export class StudentTitleAnalyzerComponent {
  projectService = inject(ProjectService);
  homeStateService = inject(HomeStateService);

  handleAnalyzeClicked() {
    this.homeStateService.setAlreadyHaveTitle(true);
  }
}
