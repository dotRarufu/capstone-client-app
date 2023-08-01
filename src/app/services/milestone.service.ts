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

@Injectable({
  providedIn: 'root',
})
export class MilestoneService {
  private readonly client = supabaseClient;
  private updateMilestonesSubject = new BehaviorSubject('');
  updateMilestones$ = this.updateMilestonesSubject.asObservable();

  constructor() {}

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
      switchMap((_) => req),
      map((res) => {
        const { data } = errorFilter(res);
        return data;
      }),
      map((milestones) => milestones.map((m) => m.id)),
      switchMap((ids) => {
        const a = ids.map((id) => this.getMilestoneData(id));

        return forkJoin(a);
      })
    );

    return req$;
  }

  getMilestoneData(id: number) {
    const req = this.client.from('milestone_data').select('*').eq('id', id);
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
