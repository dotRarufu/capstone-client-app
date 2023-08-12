import { Injectable, inject } from '@angular/core';
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
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MilestoneService {
  private readonly client = supabaseClient;
  private updateMilestonesSubject = new BehaviorSubject('');
  updateMilestones$ = this.updateMilestonesSubject.asObservable();
  private updateMilestoneTemplatesSubject = new BehaviorSubject('');
  updateMilestonetemplatess$ =
    this.updateMilestoneTemplatesSubject.asObservable();

  authService = inject(AuthService);

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

  getMilestoneTemplateData(id: number) {
    const req = this.client
      .from('milestone_template_data')
      .select('*')
      .eq('id', id);
    const req$ = from(req).pipe(
      take(1),
      map((res) => {
        const { data } = errorFilter(res);

        if (data.length === 0)
          throw new Error('milestone template data does not exist');

        return data[0];
      })
    );

    return req$;
  }

  getMilestoneTemplates(userId: string) {
    const req = this.client
      .from('milestone_template_data')
      .select('*')
      .eq('user_uid', userId);
    const req$ = from(req);
    const res =this.updateMilestonetemplatess$.pipe(
      switchMap(_ => req$),
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      })
    );

    return res;
  }

  deleteTemplate(templateId: number) {
    const req = this.client
      .from('milestone_template_data')
      .delete()
      .eq('id', templateId);
    const req$ = from(req).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap((_) => this.signalMilestoneTemplatesUpdate())
    );

    return req$;
  }

  updateTemplate(templateId: number, data: {}) {
    const req = this.client
      .from('milestone_template_data')
      .update(data)
      .eq('id', templateId)
      .select('*');
    const req$ = from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        if (data.length === 0)
          throw new Error('error updating milestone template data');

        return data[0];
      }),
      tap((_) => this.signalMilestoneTemplatesUpdate())
    );

    return req$;
  }

  addTemplate(
    userUid: string,
    data: { title: string; description: string; dueDate: string }
  ) {
    const { title, description, dueDate } = data;

    const res$ = from(
      this.client.from('milestone_template_data').insert({
        title,
        description,
        due_date: dueDate,
        user_uid: userUid,
      })
    ).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap((_) => this.signalMilestoneTemplatesUpdate())
    );

    return res$;
  }

  private signalMilestonesUpdate() {
    const old = this.updateMilestonesSubject.getValue();
    this.updateMilestonesSubject.next(old + 1);
  }
  private signalMilestoneTemplatesUpdate() {
    const old = this.updateMilestoneTemplatesSubject.getValue();
    this.updateMilestoneTemplatesSubject.next(old + 1);
  }
}
