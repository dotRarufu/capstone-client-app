import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AvailableSchedule, Consultation } from 'src/app/types/collection';

@Injectable({ providedIn: 'platform' })
export class ConsultationStateService {
  private readonly consultationSubject =
    new BehaviorSubject<Consultation | null>(null);
  consultation$ = this.consultationSubject.asObservable();
  private readonly activeScheduleSubject =
    new BehaviorSubject<AvailableSchedule | null>(null);
  activeSchedule$ = this.activeScheduleSubject.asObservable();

  getActiveConsultation() {
    return this.consultationSubject.getValue();
  }

  setActiveConsultation(c: Consultation) {
    return this.consultationSubject.next(c);
  }
  getActiveSchedule() {
    return this.activeScheduleSubject.getValue();
  }

  setActiveSchedule(c: AvailableSchedule | null) {
    return this.activeScheduleSubject.next(c);
  }
}
