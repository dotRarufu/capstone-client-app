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

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly client = supabaseClient;

  constructor() {}

  add(task: Task) {
    const request = this.client.from('task').insert(task);
    const request$ = from(request);

    return request$;
  }

  delete(taskId: number) {
    const request = this.client.from('task').delete().eq('id', taskId);
    const request$ = from(request);

    return request$;
  }

  edit(id: number, title: string, description: string) {
    const data = {
      title,
      description,
    };

    const request = this.client.from('task').update(data).eq('id', id);
    const request$ = from(request);

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
    const request$ = from(request).pipe(
      map((response) => {
        if (response.error)
          throw new Error(`error while fetching tasks 1: ${response.error}`);

        return response.data;
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
}
