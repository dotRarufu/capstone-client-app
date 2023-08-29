import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

// Still accessible by other pages, but not from another app
@Injectable({ providedIn: 'platform' })
export class HomeStateService {
  private readonly activeProjectIdSubject = new BehaviorSubject<number | null>(
    null
  );
  private readonly alreadyHaveTitleSubject = new BehaviorSubject<
    boolean | null
  >(null);

  activeProjectId$ = this.activeProjectIdSubject
    .asObservable();
  alreadyHaveTitle$ = this.alreadyHaveTitleSubject.asObservable();

  setActiveProjectId(id: number) {
    this.activeProjectIdSubject.next(id);
  }

  setAlreadyHaveTitle(v: boolean) {
    this.alreadyHaveTitleSubject.next(v);
  }
}
