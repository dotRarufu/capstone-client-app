import { Injectable } from '@angular/core';
import supabaseClient from '../lib/supabase';
import {
  BehaviorSubject,
  filter,
  from,
  map,
  merge,
  of,
  switchMap,
  tap,
  zip,
  forkJoin,
  retry,
  Observable,
  throwError,
  first,
  take,
} from 'rxjs';
import errorFilter from '../utils/errorFilter';
import { dateToDateString } from '../utils/dateToDateString';

@Injectable({
  providedIn: 'root',
})
export class MilestoneService {
  private readonly client = supabaseClient;
  private updateMilestonesSubject = new BehaviorSubject('');
  updateMilestones$ = this.updateMilestonesSubject.asObservable();

  constructor() {}

  add(
    projectId: number,
    data: { title: string; description: string; dueDate: string }
  ) {
    const req = this.client
      .from('milestone')
      .insert({ project_id: projectId })
      .select('id');
    const req$ = from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        if (data.length === 0) throw new Error('failed to create milestone');

        return data[0].id;
      }),
      tap((_) => console.log('this runs:', data)),
      switchMap((id) => this.createMilestoneData(id, data)),
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap((_) => this.signalMilestonesUpdate())
    );

    return req$;
  }

  private createMilestoneData(
    milestoneId: number,
    data: { title: string; description: string; dueDate: string }
  ) {
    const req = this.client.from('milestone_data').insert({
      description: data.description,
      title: data.title,
      due_date: data.dueDate,
      milestone_id: milestoneId,
    });
    const req$ = from(req);

    return req$;
  }

  delete(milestoneDataId: number) {
    const req = this.client
      .from('milestone')
      .delete()
      .eq('id', milestoneDataId);
    const req$ = from(req).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap((_) => this.signalMilestonesUpdate())
    );

    return req$;
  }

  update(milestoneDataId: number, data: {}) {
    const req = this.client
      .from('milestone_data')
      .update(data)
      .eq('id', milestoneDataId)
      .select('*');
    const req$ = from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        if (data.length === 0) throw new Error('error updating milestone data');

        return data[0];
      }),
      tap((_) => this.signalMilestonesUpdate())
    );

    return req$;
  }

  getMilestones(projectId: number) {
    const req = this.client
      .from('milestone')
      .select('*')
      .eq('project_id', projectId);
    const req$ = this.updateMilestones$.pipe(
      tap(() => console.log('runs')),
      switchMap((_) => req),
      map((res) => {
        const { data } = errorFilter(res);
        return data;
      }),
      map((milestones) => milestones.map((m) => m.id)),
      tap((a) => console.log('runs2 | ids:', a)),

      switchMap((ids) => {
        const a = ids.map((id) => this.getMilestoneData(id));
        return forkJoin(a);
      }),
      tap((a) => console.log('runs3'))
    );

    return req$;
  }

  getMilestoneData(id: number) {
    const req = this.client
      .from('milestone_data')
      .select('*')
      .eq('milestone_id', id);
    const req$ = from(req).pipe(
      take(1),
      map((res) => {
        const { data } = errorFilter(res);

        if (data.length === 0) throw new Error('milestone data does not exist');

        return data[0];
      })
    );

    return req$;
  }

  private signalMilestonesUpdate() {
    const old = this.updateMilestonesSubject.getValue();
    this.updateMilestonesSubject.next(old + 1);
  }
}
