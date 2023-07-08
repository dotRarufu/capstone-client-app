import { Injectable } from '@angular/core';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import {
  BehaviorSubject,
  Observable,
  forkJoin,
  from,
  map,
  merge,
  mergeAll,
  mergeMap,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Consultation } from '../types/collection';
import { getCurrentEpochTime } from '../utils/getCurrentEpochTime';
import { ConsultationData } from '../models/consultationData';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {
  private readonly client;
  private newConsultationSignal$ = new BehaviorSubject(0);

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {
    this.client = this.supabaseService.client;
  }

  scheduleConsultation(data: ConsultationData, projectId: number) {
    const user$ = from(this.authService.getAuthenticatedUser());
    const request$ = user$.pipe(
      map((user) => {
        if (user === null) throw new Error('must be impossible');

        return user;
      }),
      switchMap((user) => this.insertConsultation(user.uid, data, projectId)),
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

  private markAsComplete(id: number) {
    const data = {
      category_id: 2,
    };
    const request = this.client.from('consultation').update(data).eq('id', id);
    const request$ = from(request).pipe(
      map((res) => {
        if (res.error !== null) throw new Error('failed: mark as complete');

        return res.statusText;
      })
    );

    return request$;
  }

  private insertConsultationOutcome(
    outcomeId: number,
    contents: string[],
    consultationId: number
  ) {
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

    const request = Promise.all(
      contents.map(async (c) => {
        try {
          const data = {
            content: c,
            consultation_id: consultationId,
          };
          const response = await this.client.from(tableName).insert(data);

          if (response.error !== null)
            throw new Error('error in inserting outcome');

          return response.statusText;
        } catch (err) {
          throw new Error('error:' + err);
        }
      })
    );

    return from(request);
  }

  handleInvitation(id: number, decision: boolean) {
    const data = {
      category_id: decision ? 1 : 3,
    };
    const request = this.client.from('consultation').update(data).eq('id', id);
    const request$ = from(request).pipe(
      map((res) => {
        if (res.error !== null) throw new Error('error handling invitation');

        return res.statusText;
      }),
      tap((_) => this.signalNewConsultation())
    );

    return request$;
  }

  private signalNewConsultation() {
    const old = this.newConsultationSignal$.getValue();

    this.newConsultationSignal$.next(old + 1);
  }

  // todo: maybe move in db service
  private insertConsultation(
    userUid: string,
    data: ConsultationData,
    projectId: number
  ) {
    const newData = {
      organizer_id: userUid,
      project_id: projectId,
      date_time: data.dateTime,
      location: data.location,
      description: data.description,
    };

    const insertConsultation = this.client
      .from('consultation')
      .insert(newData)
      .select('id');

    return from(insertConsultation).pipe(
      map((res) => {
        if (res.error !== null) throw new Error('error inserting consultation');

        return res.data[0].id;
      }),

      switchMap((id) => this.insertAccomplishedTasks(id, data.taskIds))
    );
  }

  // todo: move in task service
  private insertAccomplishedTasks(consultationId: number, taskIds: number[]) {
    const request = Promise.all(
      taskIds.map(async (id) => {
        try {
          const data = {
            consultation_id: consultationId,
            task_id: id,
          };
          const response = await this.client
            .from('accomplished_task')
            .insert(data)
            .select('*');

          if (response.error !== null)
            throw new Error('error in inserting accomplished task');

          console.log('data:', response.data);

          return response.statusText;
        } catch (err) {
          throw new Error('error in inserting accomplished task');
        }
      })
    );

    return from(request);
  }

  getConsultations(projectId: number, categoryId: number) {
    const request$ = from(
      this.client
        .from('consultation')
        .select('*')
        .eq('project_id', projectId)
        .eq('category_id', categoryId)
    );

    const res = this.newConsultationSignal$.pipe(
      switchMap((_) => request$),
      map((response) => {
        if (response.error)
          throw new Error(`error while fetching tasks 2: ${response.error}`);

        return response.data;
      })
    );

    return res;
  }

  cancelInvitation(id: number) {
    const deleteReq = this.client.from("consultation").delete().eq("id", id);
    const deleteReq$ = from(deleteReq).pipe(
      map(res => {
        if (res.error !== null) throw new Error("failed deleting invitation");

        return res.statusText
      }),
      tap(() => this.signalNewConsultation())
    );

    return deleteReq$;
  }

  getConsultationOutcomes(id: number) {
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
        if (res.error !== null)
          throw new Error('error getting actual accomplishments');

        return res.data.map((r) => r.content);
      })
    );
    const proposedNextSteps$ = from(proposedNextSteps).pipe(
      map((res) => {
        if (res.error !== null)
          throw new Error('error gettingproposed next steps');

        return res.data.map((r) => r.content);
      })
    );
    const nextDeliverables$ = from(nextDeliverables).pipe(
      map((res) => {
        if (res.error !== null)
          throw new Error('error getting nextDeliverables');

        return res.data.map((r) => r.content);
      })
    );

    const res$ = forkJoin({
      actualAccomplishments: actualAccomplishments$,
      proposedNextSteps: proposedNextSteps$,
      nextDeliverables: nextDeliverables$,
    });

    return res$;
  }
}
