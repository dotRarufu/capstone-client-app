import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { AvailableScheduleRow, ProjectInvitationRow, ProjectRow } from 'src/app/types/collection';

export type SelectedScheduleNotification =  AvailableScheduleRow & {project: ProjectRow, formattedStartTime: string};

// Still accessible by other pages, but not from another app
@Injectable({ providedIn: 'platform' })
export class ProfileStateService {
  private readonly selectedMilestoneIdSubject = new BehaviorSubject<
    number | null
  >(null);

  selectedMilestoneId$ = this.selectedMilestoneIdSubject.asObservable();
  private readonly selectedScheduleNotificationSubject = new BehaviorSubject<
  SelectedScheduleNotification | null
  >(null);

  selectedScheduleNotification$ = this.selectedScheduleNotificationSubject.asObservable();

  setSelectedMilestoneId(id: number| null) {
    this.selectedMilestoneIdSubject.next(id);
  }
  setSelectedScheduleNotification(d: SelectedScheduleNotification) {
    this.selectedScheduleNotificationSubject.next(d);
  }
  getSelectedScheduleNotification() {
return     this.selectedScheduleNotificationSubject.getValue();
  }
}
