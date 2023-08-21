import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Consultation } from 'src/app/types/collection';

@Injectable({ providedIn: 'platform' })
export class ConsultationStateService {
  private readonly consultationSubject =
    new BehaviorSubject<Consultation | null>(null);
  consultation$ = this.consultationSubject.asObservable();

  getActiveConsultation() {
    return this.consultationSubject.getValue();
  }

  setActiveConsultation(c: Consultation) {
    return this.consultationSubject.next(c);
  }
}
