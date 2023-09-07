import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

// Still accessible by other pages, but not from another app
@Injectable({ providedIn: 'platform' })
export class ProfileStateService {
  private readonly selectedMilestoneIdSubject = new BehaviorSubject<
    number | null
  >(null);

  selectedMilestoneId$ = this.selectedMilestoneIdSubject.asObservable();

  setSelectedMilestoneId(id: number| null) {
    this.selectedMilestoneIdSubject.next(id);
  }
}
