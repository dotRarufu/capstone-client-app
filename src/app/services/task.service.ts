import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthResponse,
} from '@supabase/supabase-js';
import {
  BehaviorSubject,
  forkJoin,
  from,
  map,
  merge,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs';
import { Task, User } from '../types/collection';
import errorFilter from '../utils/errorFilter';
import supabaseClient from '../lib/supabase';
import { AuthService } from './auth.service';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly client = supabaseClient;
  private readonly taskUpdateSubject = new BehaviorSubject<number>(0);

  constructor(
    private authService: AuthService,
    private projectService: ProjectService
  ) {}

  add(title: string, description: string, statusId: number) {
    // todo: separate in another function
    const userUid$ = from(this.authService.getAuthenticatedUser()).pipe(
      map((user) => {
        if (user === null) throw new Error('could not get authenticated user');

        return user.uid;
      })
    );
    const projectId = this.projectService.activeProjectId();

    const add$ = userUid$.pipe(
      map((uid) => {
        const data = {
          title,
          description,
          status_id: statusId,
          assigner_id: uid,
          project_id: projectId,
        };
        return data;
      }),
      switchMap((data) => {
        const request = this.client.from('task').insert(data);

        return request;
      }),
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap((_) => this.signalNewTask())
    );

    return add$;
  }

  delete(taskId: number) {
    const request = this.client.from('task').delete().eq('id', taskId);
    const request$ = from(request);
    const delete$ = request$.pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap((_) => this.signalNewTask())
    );

    return delete$;
  }

  edit(id: number, title: string, description: string) {
    const data = {
      title,
      description,
    };

    const request = this.client.from('task').update(data).eq('id', id);
    const request$ = from(request);
    const edit$ = request$.pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap((_) => this.signalNewTask())
    );

    return request$;
  }

  changeStatus(id: number, statusId: number) {
    const data = {
      status_id: statusId,
    };
    const request = this.client.from('task').update(data).eq('id', id);
    const request$ = from(request);

    return request$;
  }

  getTasks(statusId: number, projectId: number) {
    const request = this.client
      .from('task')
      .select('*')
      .eq('status_id', statusId)
      .eq('project_id', projectId);
    const request$ = this.taskUpdateSubject.pipe(
      switchMap((_) => from(request)),
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      })
    );

    return request$;
  }

  getAccompishedTasks(consultationId: number) {
    const taskIds = this.client
      .from('accomplished_task')
      .select('task_id')
      .eq('consultation_id', consultationId);

    const tasks$ = from(taskIds).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      }),
      switchMap((taskIds) => {
        const tasks$ = taskIds.map(({ task_id: id }) => this.getTask(id));

        return forkJoin(tasks$);
      })
    );

    return tasks$;
  }

  getTask(id: number) {
    const request = this.client.from('task').select('*').eq('id', id);
    const request$ = from(request).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data[0];
      })
    );

    return request$;
  }

  private signalNewTask() {
    const old = this.taskUpdateSubject.getValue();
    this.taskUpdateSubject.next(old + 1);
  }
}
