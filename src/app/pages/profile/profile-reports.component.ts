import { Component, Input, inject } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { filter, forkJoin, map, of, switchMap, take, tap } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import getRoleName from 'src/app/utils/getRoleName';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';
import getUniqueItems from 'src/app/utils/getUniqueItems';
import { ScheduleNotificationDetailsModalComponent } from './schedule-notification-detail-modal.component';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import {
  ProfileStateService,
  SelectedScheduleNotification,
} from './data-access/profile-state.service';
import { isNotNull } from 'src/app/utils/isNotNull';
import { Router } from '@angular/router';
import { getRolePath } from 'src/app/utils/getRolePath';
import { AdviserProfileReportsComponent } from './adviser-profile-reports.component';
import { StudentProfileReportsComponent } from './student-profile-reports.component';

@Component({
  
  standalone: true,
  imports: [
    CommonModule,
    AdviserProfileReportsComponent,
    StudentProfileReportsComponent
  ],
  template: `
  <ng-container *ngIf="{user: user$ | async} as observables">
    <adviser-profile-reports *ngIf="observables.user?.role_id === 5"/>
    <student-profile-reports *ngIf="observables.user?.role_id === 0" />
</ng-container>

    
  `,
})
export class ProfileReportsComponent {
  authService = inject(AuthService);
 
  user$ = this.authService.getAuthenticatedUser().pipe(
    filter(isNotNull)
  )
  
}
