import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  forkJoin,
  from,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { ConsultationData } from '../models/consultationData';
import { AuthService } from './auth.service';
import errorFilter from '../utils/errorFilter';
import supabaseClient from '../lib/supabase';
import dateToEpoch from '../utils/dateToEpoch';
import { isNotNull } from '../utils/isNotNull';
import { ProjectService } from './project.service';
import combineDateAndTime from '../utils/combineDateAndTime';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {
  private readonly client = supabaseClient;
  private newConsultationSignal$ = new BehaviorSubject(0);
  newConsultation$ = this.newConsultationSignal$.asObservable();

  authService = inject(AuthService);
  projectService = inject(ProjectService);

  scheduleConsultation(data: ConsultationData, projectId: number) {
    if (projectId < 0)
      return throwError(() => new Error('Project id is invalid'));

    if (data.scheduleId < 0)
      return throwError(() => new Error('Schedule id is invalid'));
    if (data.description === '')
      return throwError(() => new Error('Description is invalid'));
    if (data.location === '')
      return throwError(() => new Error('Location is invalid'));

    const user$ = this.authService.getAuthenticatedUser().pipe(
      map((user) => {
        if (user === null) throw new Error('must be impossible');

        return user;
      })
    );

    const request$ = user$.pipe(
      switchMap((user) => this.insertConsultation(user.uid, data, projectId)),
      switchMap((_) =>
        this.authService.markScheduleUnavailable(data.scheduleId, projectId)
      ),
      tap(() => this.signalNewConsultation())
    );

    return request$;
  }

  completeScheduled(
    id: number,
    actualAccomplishments: string[],
    proposedNextSteps: string[],
    nextDeliverables: string[]
  ) {
    if (id < 0) return throwError(() => new Error('Id is invalid'));

    const request$ = this.markAsComplete(id).pipe(
      switchMap((_) =>
        this.insertConsultationOutcome(0, actualAccomplishments, id)
      ),
      switchMap((_) =>
        this.insertConsultationOutcome(1, proposedNextSteps, id)
      ),
      switchMap((_) => this.insertConsultationOutcome(2, nextDeliverables, id)),
      tap((_) => this.signalNewConsultation())
    );

    return request$;
  }

  handleInvitation(id: number, decision: boolean) {
    if (id < 0) return throwError(() => new Error('Id is invalid'));

    const data = {
      category_id: decision ? 1 : 3,
    };
    const request = this.client.from('consultation').update(data).eq('id', id);
    const request$ = from(request).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap((_) => this.signalNewConsultation())
    );

    return request$;
  }

  getConsultations(categoryId: number, projectId: number) {
    if (projectId < 0)
      return throwError(() => new Error('Project id is invalid'));
    if (categoryId < 0)
      return throwError(() => new Error('category id is invalid'));

    const res = this.newConsultationSignal$.pipe(
      switchMap(() => {
        const request$ = from(
          this.client
            .from('consultation')
            .select('*')
            .eq('project_id', projectId)
            .eq('category_id', categoryId)
        );

        return request$;
      }),
      map((response) => {
        if (response.error)
          throw new Error(`error while fetching tasks 2: ${response.error}`);

        return response.data;
      })
    );

    return res;
  }

  getAllConsultations(projectId: number) {
    if (projectId < 0)
      return throwError(() => new Error('Project id is invalid'));

    const res = this.newConsultationSignal$.pipe(
      switchMap(() => {
        const request$ = from(
          this.client
            .from('consultation')
            .select('*')
            .eq('project_id', projectId)
        );

        return request$;
      }),
      map((response) => {
        if (response.error)
          throw new Error(`error while fetching tasks 2: ${response.error}`);

        return response.data;
      })
    );

    return res;
  }

  cancelInvitation(id: number) {
    if (id < 0)
      return throwError(() => new Error('consultation id is invalid'));

    // todo: fix foreign key violation
    const deleteReq = this.client.from('consultation').delete().eq('id', id);
    const deleteReq$ = from(deleteReq).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap(() => this.signalNewConsultation())
    );

    return deleteReq$;
  }

  getConsultationOutcomes(id: number) {
    if (id < 0)
      return throwError(() => new Error('consultation id is invalid'));

    const actualAccomplishments = this.client
      .from('actual_accomplishment')
      .select('content')
      .eq('consultation_id', id);
    const proposedNextSteps = this.client
      .from('proposed_next_step')
      .select('content')
      .eq('consultation_id', id);
    const nextDeliverables = this.client
      .from('next_deliverable')
      .select('content')
      .eq('consultation_id', id);

    const actualAccomplishments$ = from(actualAccomplishments).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data.map((r) => r.content);
      })
    );
    const proposedNextSteps$ = from(proposedNextSteps).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data.map((r) => r.content);
      })
    );
    const nextDeliverables$ = from(nextDeliverables).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data.map((r) => r.content);
      })
    );

    const res$ = forkJoin({
      actualAccomplishments: actualAccomplishments$,
      proposedNextSteps: proposedNextSteps$,
      nextDeliverables: nextDeliverables$,
    });

    return res$;
  }

  private markAsComplete(id: number) {
    const data = {
      category_id: 2,
    };
    const request = this.client.from('consultation').update(data).eq('id', id);
    const request$ = from(request).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      })
    );

    return request$;
  }

  getConsultationData(projectId: number, date: number) {
    console.log('req:', projectId, date);
    const req = this.client
      .from('consultation')
      .select('*')
      .eq('project_id', projectId)
      .eq('date_time', date)
      .single();

    const req$ = from(req).pipe(
      map((res) => {
        const resA = errorFilter(res);

        return resA.data;
      })
    );

    return req$;
  }

  checkHasScheduledConsultation() {
    return this.authService.getAuthenticatedUser().pipe(
      filter(isNotNull),
      switchMap((u) => {
        return this.projectService.getProjects().pipe(
          filter(isNotNull),
          map((p) => {
            if (p.length === 0)
              throw new Error('User has no scheduled consultation');

            return p;
          }),
          map((p) => p.map((a) => a.id)),
          switchMap((ids) => {
            const counts = ids.map((id) => {
              const req = this.client
                .from('consultation')
                .select('*')
                .eq('project_id', id)
                .eq('category_id', 1);
              const scheduleConsultations$ = from(req).pipe(
                map((res) => {
                  const { data } = errorFilter(res);
                  
                  return data;
                }),
             
                map((scheduled) => scheduled.length),
           
              );

              return scheduleConsultations$;
            });

            return forkJoin(counts);
          }),
       
          map(d => d.filter(a => a > 0).length > 0),
       
        );
      })
    );
  }

  private insertConsultationOutcome(
    outcomeId: number,
    contents: string[],
    consultationId: number
  ) {
    const request = Promise.all(
      contents.map(async (c) => {
        const data = {
          content: c,
          consultation_id: consultationId,
        };
        const response = await this.client
          .from(this.getTableName(outcomeId))
          .insert(data);

        const { statusText } = errorFilter(response);

        return statusText;
      })
    );

    return from(request);
  }

  private getTableName(outcomeId: number) {
    let tableName = '';
    switch (outcomeId) {
      case 0:
        tableName = 'actual_accomplishment';
        break;
      case 1:
        tableName = 'proposed_next_step';
        break;
      case 2:
        tableName = 'next_deliverable';
        break;

      default:
        throw new Error('unknwon outcomeId');
    }

    return tableName;
  }

  private insertConsultation(
    userUid: string,
    data: ConsultationData,
    projectId: number
  ) {
    const dateTime$ = this.authService.getScheduleData(data.scheduleId);
    return dateTime$.pipe(
      switchMap((dateTime) => {
        // const date = new Date(dateTime.date);
        // const time = new Date(0);
        // time.setUTCSeconds(dateTime.start_time);

        // const hours = time.getHours();
        // const minutes = time.getMinutes();
        // const seconds = time.getSeconds();
        // const milliseconds = time.getMilliseconds();

        // date.setHours(hours);
        // date.setMinutes(minutes);
        // date.setSeconds(seconds);
        // date.setMilliseconds(milliseconds);

        // Format the Date object
        // const formattedDate = date.toLocaleString('en-US', {
        //   year: 'numeric',
        //   month: '2-digit',
        //   day: '2-digit',
        //   hour: '2-digit',
        //   minute: '2-digit',
        //   hour12: true,
        // });
        // console.log('new date epoch:', dateToEpoch(date));

        const newData = {
          organizer_id: userUid,
          project_id: projectId,
          date_time: combineDateAndTime(dateTime.date, dateTime.start_time),
          location: data.location,
          description: data.description,
        };

        const insertConsultation = this.client
          .from('consultation')
          .insert(newData)
          .select('id');

        return from(insertConsultation).pipe(
          map((res) => {
            const { data } = errorFilter(res);

            return data[0].id;
          })
        );
      }),
      switchMap((id) => this.insertAccomplishedTasks(id, data.taskIds))
    );
  }

  private insertAccomplishedTasks(consultationId: number, taskIds: number[]) {
    const request = Promise.all(
      taskIds.map(async (id) => {
        const data = {
          consultation_id: consultationId,
          task_id: id,
        };
        const response = await this.client
          .from('accomplished_task')
          .insert(data)
          .select('*');

        const { statusText } = errorFilter(response);

        return statusText;
      })
    );

    return from(request);
  }

  private signalNewConsultation() {
    const old = this.newConsultationSignal$.getValue();

    this.newConsultationSignal$.next(old + 1);
  }
}
