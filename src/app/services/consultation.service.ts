import { Injectable } from '@angular/core';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import {
  Observable,
  forkJoin,
  from,
  map,
  merge,
  mergeAll,
  mergeMap,
  of,
  switchMap,
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
      switchMap((user) => this.insertConsultation(user.uid, data, projectId))
    );

    return request$;
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

    const request = this.client
      .from('consultation')
      .insert(newData)
      .select('id');
    //  todo: insert task ids in accomplishedtask table

    return from(request).pipe(
      map((res) => {
        if (res.error !== null) throw new Error('error inserting consultation');

        return res.data[0].id;
      }),
      // todo: see if switchmap works, i think merge is better for this
      switchMap((id) => this.insertAccomplishedTasks(id, data.taskIds))
    );
  }

  private insertAccomplishedTasks(consultationId: number, taskIds: number[]) {
    const insertRequests$ = taskIds.map((tId) => {
      const data = {
        consultation_id: consultationId,
        task_id: tId,
      };
      const request = this.client.from('accomplished_task').insert(data);

      return from(request).pipe(
        map((res) => {
          if (res.error !== null)
            throw new Error('error inserting data in accomplsihed tasks');

          return res.statusText;
        })
      );
    });

    return forkJoin([...insertRequests$]);
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

    const res = from(request$).pipe(
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
