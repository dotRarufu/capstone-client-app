import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tab, TabDefinition } from '../models/tab';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  private tabsSubject = new BehaviorSubject<Tab[] | null>(null);
  private activeIdSubject = new BehaviorSubject<string>('default');
  tabs$ = this.tabsSubject.asObservable();
  activeId$ = this.activeIdSubject.asObservable();

  constructor(private router: Router) {}

  private setActive(id: string) {
    const tabs = this.tabsSubject.getValue();

    if (tabs === null) return;

    const newTabs = tabs.map((t) =>
      t.id === id ? { ...t, active: true } : { ...t, active: false }
    );

    this.tabsSubject.next(newTabs);
  }

  // expect to run only in init
  setTabs(tabs: TabDefinition[], route: string[], defaultActiveId?: string) {
    const newTabs: Tab[] = tabs.map((t) => ({
      ...t,
      active: defaultActiveId === t.id,
      handler: () => {
        console.log('runs', route);
        this.router.navigate([...route, t.id]);
        this.setActive(t.id);
        this.activeIdSubject.next(t.id);
      },
    }));

    if (defaultActiveId !== undefined) {
      this.activeIdSubject.next(defaultActiveId);
    }

    this.tabsSubject.next(newTabs);
  }
}
