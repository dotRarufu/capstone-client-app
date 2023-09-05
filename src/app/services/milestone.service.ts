import { Injectable, inject } from '@angular/core';
import supabaseClient from '../lib/supabase';
import {
  BehaviorSubject,
  filter,
  from,
  map,
  of,
  switchMap,
  tap,
  forkJoin,
  throwError,
  take,
} from 'rxjs';
import errorFilter from '../utils/errorFilter';
import { AuthService } from './auth.service';
import { isNotNull } from '../utils/isNotNull';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class MilestoneService {
  private readonly client = supabaseClient;
  private updateMilestonesSubject = new BehaviorSubject(0);
  private updateMilestoneTemplatesSubject = new BehaviorSubject(0);
  updateMilestones$ = this.updateMilestonesSubject.asObservable();
  updateMilestonetemplatess$ =
    this.updateMilestoneTemplatesSubject.asObservable();

  authService = inject(AuthService);
  projectService = inject(ProjectService);

  add(
    projectId: number,
    data: { title: string; description: string; dueDate: string }
  ) {
    if (projectId < 0)
      return throwError(() => new Error('Project id is invalid'));
    if (data.title === '')
      return throwError(() => new Error('title is invalid'));
    if (data.description === '')
      return throwError(() => new Error('description is invalid'));
    if (data.dueDate === '')
      return throwError(() => new Error('due date is invalid'));

    const req = this.client
      .from('milestone')
      .insert({ project_id: projectId })
      .select('id');
    const req$ = from(req).pipe(
      take(1),
      map((res) => {
        const { data } = errorFilter(res);

        if (data.length === 0) throw new Error('failed to create milestone');

        return data[0].id;
      }),
      switchMap((id) => this.createMilestoneData(id, data)),
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
    const req$ = from(req).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      })
    );

    return req$;
  }

  delete(milestoneDataId: number) {
    if (milestoneDataId < 0)
      return throwError(() => new Error('milestone data id is invalid'));

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

  // todo: add type for data param
  update(milestoneDataId: number, data: {}) {
    if (milestoneDataId < 0)
      return throwError(() => new Error('milestone data id is invalid'));

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

  // todo: use takeUntilDestroyed for this method's users
  getMilestones(projectId: number) {
    if (projectId < 0)
      return throwError(() => new Error('projectId is invalid'));

    const req$ = this.updateMilestones$.pipe(
      switchMap((_) =>
        this.client.from('milestone').select('*').eq('project_id', projectId)
      ),
      map((res) => {
        const { data } = errorFilter(res);
        return data;
      }),
      map((milestones) => milestones.map((m) => m.id)),
      switchMap((ids) => {
        if (ids.length === 0) return of([]);

        const a = ids.map((id) => this.getMilestoneData(id));

        return forkJoin(a);
      })
    );

    return req$;
  }

  getMilestoneData(id: number) {
    if (id < 0) return throwError(() => new Error('id is invalid'));

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
    if (id < 0) return throwError(() => new Error('id is invalid'));

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

  getMilestoneTemplates(userUid: string) {
    if (userUid === '')
      return throwError(() => new Error('userUid is invalid'));

    const req = this.client
      .from('milestone_template_data')
      .select('*')
      .eq('user_uid', userUid);
    const req$ = from(req);
    const res = this.updateMilestonetemplatess$.pipe(
      switchMap((_) => req$),
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      })
    );

    return res;
  }

  deleteTemplate(templateId: number) {
    if (templateId < 0)
      return throwError(() => new Error('templateId is invalid'));

    const req = this.client
      .from('milestone_template_data')
      .delete()
      .eq('id', templateId);
    const req$ = from(req).pipe(
      take(1),
      map((res) => {
        const { statusText } = errorFilter(res);
        console.log('delete templateid:', templateId);
        return statusText;
      }),
      tap((_) => this.signalMilestoneTemplatesUpdate())
    );

    return req$;
  }

  // todo: add type for data param
  updateTemplate(templateId: number, data: {}) {
    if (templateId < 0)
      return throwError(() => new Error('templateId is invalid'));

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

  // todo: add type for data param
  addTemplate(
    userUid: string,
    data: { title: string; description: string; dueDate: string }
  ) {
    if (userUid === '')
      return throwError(() => new Error('userUid is invalid'));

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

  reapplyTemplates() {
    const user$ = this.authService.getAuthenticatedUser().pipe(
      tap((u) => console.log('user:', u)),
      filter(isNotNull)
    );
    const projects$ = this.projectService.getProjects().pipe(
      take(2),
      tap((u) => console.log('projects:', u)),
      filter(isNotNull)
    );
    const req$ = forkJoin({ user: user$, projects: projects$ }).pipe(
      tap((u) => console.log('runss!:', u)),
      switchMap(({ user, projects }) => {
        const req$ = projects.map((p) =>
          this.applyCapstoneAdviserTemplate(user.uid, p.id)
        );

        return forkJoin(req$);
      })
    );

    return req$;
  }

  applyCapstoneAdviserTemplate(userUid: string, projectId: number) {
    console.log('called!');
    const templates$ = this.getMilestoneTemplates(userUid);
    const milestoneIds$ = from(
      this.client.from('milestone').select('id').eq('project_id', projectId)
    ).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      }),
      map((ids) => ids.map(({ id }) => id))
    );

    const deleteReq$ = milestoneIds$.pipe(
      switchMap((ids) => {
        const a = ids.map((id) => this.delete(id));

        if (ids.length === 0) return of([]);

        return forkJoin(a);
      })
    );
    const addReq$ = templates$.pipe(
      take(1),
      tap((_) => console.log('adds new milestones')),
      switchMap((templates) => {
        if (templates.length === 0) return of([]);

        const reqs$ = templates.map((t) =>
          this.add(projectId, {
            title: t.title,
            description: t.description,
            dueDate: t.due_date,
          })
        );

        return forkJoin(reqs$);
      })
    );

    return deleteReq$.pipe(switchMap((_) => addReq$));
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
