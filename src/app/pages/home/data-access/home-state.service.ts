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
    .asObservable()
    .pipe(tap((v) => console.log('emits:', v)));
  alreadyHaveTitle$ = this.alreadyHaveTitleSubject.asObservable();

  setActiveProjectId(id: number) {
    console.log('runs:', id);
    this.activeProjectIdSubject.next(id);
    console.log('new val:', this.activeProjectIdSubject.getValue());
  }

  setAlreadyHaveTitle(v: boolean) {
    this.alreadyHaveTitleSubject.next(v);
  }
}
