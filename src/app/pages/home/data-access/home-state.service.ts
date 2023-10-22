import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import {
  AvailableScheduleRow,
  ConsultationRow,
  ProjectRow,
  User,
} from 'src/app/types/collection';

export type ActiveConsultation = ConsultationRow & {
  dateString: string;
  project: ProjectRow;
  scheduleData: AvailableScheduleRow & { startTime: string; endTime: string };
  organizer: User;
};

// Still accessible by other pages, but not from another app
@Injectable({ providedIn: 'platform' })
export class HomeStateService {
  private readonly activeProjectIdSubject = new BehaviorSubject<number | null>(
    null
  );
  private readonly alreadyHaveTitleSubject = new BehaviorSubject<
    boolean | null
  >(null);
  private readonly activeConsultationSubject =
    new BehaviorSubject<ActiveConsultation | null>(null);
  private readonly activeRequestIdSubject =
    new BehaviorSubject<string | null>(null);
  private readonly updateRequestsSubject =
    new BehaviorSubject(0);

  activeConsultation$ = this.activeConsultationSubject.asObservable();
  activeProjectId$ = this.activeProjectIdSubject.asObservable();
  activeRequestId$ = this.activeRequestIdSubject.asObservable();
  alreadyHaveTitle$ = this.alreadyHaveTitleSubject.asObservable();
  updateRequests$ = this.updateRequestsSubject.asObservable();

  updateRequests() {
    const old = this.updateRequestsSubject.getValue();
    this.updateRequestsSubject.next(old + 1);
  }
  setActiveProjectId(id: number) {
    this.activeProjectIdSubject.next(id);
  }
  setActiveRequestId(id: string) {
    this.activeRequestIdSubject.next(id);
  }

  setAlreadyHaveTitle(v: boolean) {
    this.alreadyHaveTitleSubject.next(v);
  }
  setActiveConsultation(v: ActiveConsultation | null) {
    this.activeConsultationSubject.next(v);
  }
  getActiveConsultation() {
    return this.activeConsultationSubject.getValue();
  }
  getActiveRequestId() {
    return this.activeRequestIdSubject.getValue();
  }
}
