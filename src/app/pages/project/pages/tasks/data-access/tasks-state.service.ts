import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from 'src/app/types/collection';

@Injectable({ providedIn: 'platform' })
export class TaskStateService {
  private readonly activeTaskSubject = new BehaviorSubject<Task | null>(null);
  activeTask$ = this.activeTaskSubject.asObservable();
  private readonly tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  getActiveTask() {
    return this.activeTaskSubject.getValue();
  }

  setActiveTask(t: Task) {
    return this.activeTaskSubject.next(t);
  }
  getTasks() {
    return this.tasksSubject.getValue();
  }

  setTasks(t: Task[]) {
    return this.tasksSubject.next(t);
  }
}
