import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, from, map, switchMap, tap } from 'rxjs';
import { ConsultationData } from '../models/consultationData';
import { AuthService } from './auth.service';
import errorFilter from '../utils/errorFilter';
import { DatabaseService } from './database.service';
import supabaseClient from '../lib/supabase';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {
  private readonly client = supabaseClient;
  private newConsultationSignal$ = new BehaviorSubject(0);

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private projectService: ProjectService
  ) {}

  scheduleConsultation(data: ConsultationData, projectId: number) {
    const user$ = from(this.authService.getAuthenticatedUser()).pipe(
      map((user) => {
        if (user === null) throw new Error('must be impossible');

        return user;
      })
    );

    const request$ = user$.pipe(
      switchMap((user) =>
        this.databaseService.insertConsultation(user.uid, data, projectId)
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

  cancelInvitation(id: number) {
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

  private signalNewConsultation() {
    const old = this.newConsultationSignal$.getValue();

    this.newConsultationSignal$.next(old + 1);
  }
}
