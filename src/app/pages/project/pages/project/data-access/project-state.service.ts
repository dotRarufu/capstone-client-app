import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from 'src/app/types/collection';

@Injectable({ providedIn: 'platform' })
export class ProjectStateService {
  private readonly activeParticipantSubject = new BehaviorSubject<{
    name: string;
    role_id: number;
    uid: string;
    avatar: string;
    avatar_last_update: number | null;
    projectRole: string | null;
  } | null>(null);
  activeParticipant$ = this.activeParticipantSubject.asObservable();

  getActivePraticipant() {
    return this.activeParticipantSubject.getValue();
  }

  setActiveParticipant(t: {
    name: string;
    role_id: number;
    uid: string;
    avatar: string;
    avatar_last_update: number | null;
    projectRole: string | null;
  }) {
    return this.activeParticipantSubject.next(t);
  }
}
