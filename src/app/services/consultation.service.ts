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

  private signalNewConsultation() {
    console.log('signals new consultation');
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

  acceptConsultation() {}

  getConsultations(
    isScheduled: boolean,
    projectId: number,
    isCompleted: boolean
  ) {
    let request$: Observable<
      PostgrestSingleResponse<
        {
          date_time: number;
          description: string;
          id: number;
          is_accepted: boolean;
          location: string;
          organizer_id: string;
          project_id: number;
        }[]
      >
    >;

    if (isCompleted) {
      const currentTime = getCurrentEpochTime();
      request$ = from(
        this.client
          .from('consultation')
          .select('*')
          .eq('is_accepted', true)
          .lt('date_time', currentTime)
          .eq('project_id', projectId)
      );
    } else {
      request$ = from(
        this.client
          .from('consultation')
          .select('*')
          .eq('is_accepted', isScheduled)
          .eq('project_id', projectId)
      );
    }

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

  getConsultationDetails(consultation: Consultation) {
    // const a = this.client.from()
  }
}
