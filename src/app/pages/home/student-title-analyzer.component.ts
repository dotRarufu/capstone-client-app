import { Component, inject } from '@angular/core';
import { TitleAnalyzerComponent } from './title-analyzer.component';
import { CommonModule } from '@angular/common';
import { ResultComponent } from './result.component';
import { HomeStateService } from './data-access/home-state.service';
import { ProjectService } from '../../services/project.service';
import { tap } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'student-title-analyzer',
  standalone: true,
  imports: [
    TitleAnalyzerComponent,
    CommonModule,
    ResultComponent,
    RouterModule,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <title-analyzer
        (analyzeClicked)="homeStateService.setAlreadyHaveTitle(false)"
      />
    </div>
  `,
})
export class StudentTitleAnalyzerComponent {
  route = inject(ActivatedRoute);
  homeStateService = inject(HomeStateService);
}
