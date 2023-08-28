import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  forkJoin,
  from,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import errorFilter from '../utils/errorFilter';
import supabaseClient from '../lib/supabase';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly client = supabaseClient;
  private readonly taskUpdateSubject = new BehaviorSubject<number>(0);

  userService = inject(UserService);
  authService = inject(AuthService);

  add(title: string, description: string, projectId: number) {
    if (title === '') return throwError(() => new Error('title is invalid'));
    if (description === '')
      return throwError(() => new Error('description is invalid'));
    if (projectId < 0)
      return throwError(() => new Error('projectId is invalid'));

    // todo: separate in another function
    // todo: add check if usser is not a student
    const userUid$ = from(this.authService.getAuthenticatedUser()).pipe(
      map((user) => {
        if (user === null) throw new Error('could not get authenticated user');
        return user.uid;
      })
    );
    const taskCount = this.client
      .from('task')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .eq('status_id', 0);
    const taskCount$ = from(taskCount).pipe(
      map((res) => {
        if (res.error !== null) throw new Error('eror getting count');

        return res.count || 0;
      }),
      map((c) => {
        console.log('C:', c);
        if (c > 5) throw new Error('reached max amount of todo');

        return c;
      })
    );
    const add$ = taskCount$.pipe(
      switchMap((_) => userUid$),
      // take(1),
      map((uid) => {
        const data = {
          title,
          description,
          status_id: 0,
          assigner_id: uid,
          project_id: projectId,
          date_added: Math.floor(Date.now() / 1000),
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

  delete(taskId: number, assignerUid: string) {
    if (taskId < 0) return throwError(() => new Error('taskId is invalid'));
    if (assignerUid === '')
      return throwError(() => new Error('assignerUid is invalid'));

    const request = this.client.from('task').delete().eq('id', taskId);
    const request$ = from(request);
    const userCheck$ = from(this.authService.getAuthenticatedUser()).pipe(
      map((user) => {
        if (user === null) throw new Error('should be impossible4');

        return user.uid;
      }),
      map((uid) => {
        if (uid !== assignerUid)
          throw new Error("You can't delete task not added by you");

        return uid;
      })
    );
    const delete$ = userCheck$.pipe(
      switchMap((_) => request$),
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap((_) => this.signalNewTask())
    );

    return delete$;
  }

  edit(id: number, title: string, description: string) {
    if (title === '') return throwError(() => new Error('title is invalid'));
    if (description === '')
      return throwError(() => new Error('description is invalid'));
    if (id < 0) return throwError(() => new Error('id is invalid'));

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

    return edit$;
  }

  changeStatus(id: number, statusId: number) {
    if (statusId < 0)
      return throwError(() => new Error('status id is invalid'));
    if (id < 0) return throwError(() => new Error('id is invalid'));

    const data = {
      status_id: statusId,
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

    return edit$;
  }

  getTasks(statusId: number, projectId: number) {
    if (statusId < 0)
      return throwError(() => new Error('status id is invalid'));
    if (projectId < 0)
      return throwError(() => new Error('projectId is invalid'));

    const request$ = this.taskUpdateSubject.pipe(
      switchMap(() => {
        const request = this.client
          .from('task')
          .select('*')
          .eq('status_id', statusId)
          .eq('project_id', projectId);

        return from(request);
      }),
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      }),
      map((data) => {
        const ordered = data.sort((a, b) => a.date_added - b.date_added);

        return ordered;
      })
    );

    return request$;
  }

  getAllTasks(projectId: number) {
    if (projectId < 0)
      return throwError(() => new Error('projectId is invalid'));

    const request$ = this.taskUpdateSubject.pipe(
      switchMap(() => {
        const request = this.client
          .from('task')
          .select('*')
          .eq('project_id', projectId);
        return from(request);
      }),
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      })
    );

    return request$;
  }
  getAllTasksBy(userUid: string) {
    if (userUid === '')
      return throwError(() => new Error('user uid is invalid'));

    const request$ = this.taskUpdateSubject.pipe(
      switchMap(() => {
        const request = this.client
          .from('task')
          .select('*')
          .eq('assigner_id', userUid);
        return from(request);
      }),
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      })
    );

    return request$;
  }

  getAccompishedTasks(consultationId: number) {
    if (consultationId < 0)
      return throwError(() => new Error('consultationId is invalid'));

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

  getTaskCountByAdviser(statusId: number, projectId: number) {
    if (projectId < 0)
      return throwError(() => new Error('projectId is invalid'));
    if (statusId < 0) return throwError(() => new Error('statusId is invalid'));

    const req = this.client
      .from('task')
      .select('assigner_id')
      .eq('project_id', projectId)
      .eq('status_id', statusId);

    const req$ = from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      }),
      map((data) => {
        const assigners = new Set<string>();
        data.forEach((d) => assigners.add(d.assigner_id));

        const res = [...assigners].map((a) => ({
          id: a,
          count: data.filter((d) => d.assigner_id === a).length,
        }));

        return res;
      }),
      switchMap(async (d) => {
        const a = await Promise.all(
          d.map(async (a) => ({
            role_id: (await this.userService.getUser(a.id)).role_id,
            count: a.count,
          }))
        );

        return a;
      }),
      map((a) => {
        const res = a.map((b) => ({
          role: b.role_id === 1 ? 'Capstone Adviser' : 'Technical Adviser',
          count: b.count,
        }));

        return res;
      })
    );

    return req$;
  }

  private getTask(id: number) {
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
