import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// scrapped
export class TopAppBarService {
  private _activePath$ = new BehaviorSubject<{
    path: string;
    backBtn: boolean;
  }>({ path: 'Home', backBtn: false });
  activePath$ = this._activePath$.asObservable();
  activateBackButton = false;

  constructor() {}
  // * 3 ways to update active path
  // 1. use changeActivePath fn - will increase service count
  // 2. watch activatedRoute service - might require additional logic to when to activate back button
  // 3. use data property in route - sounds the best
  changeActivePath(path: string, activateBackButton: boolean = false) {
    this._activePath$.next({ path, backBtn: activateBackButton });
    this.activateBackButton = activateBackButton;
  }

  handleBackButtonClick() {
    // ...some more logic

    this.activateBackButton = false;
  }
}
