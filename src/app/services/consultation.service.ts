import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthResponse,
  PostgrestSingleResponse,
} from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from, map, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { CapstoolUser } from '../models/capstool-user';
import { Database } from '../types/supabase';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { DatabaseService } from './database.service';
import { Consultation, Task, User } from '../types/collection';
import { getCurrentEpochTime } from '../utils/getCurrentEpochTime';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {
  private readonly client;

  constructor(private supabaseService: SupabaseService) {
    this.client = this.supabaseService.client;
  }

  // add(task: Task) {
  //   const request = this.client.from('task').insert(task);
  //   const request$ = from(request);

  //   return request$;
  // }

  // delete(taskId: number) {
  //   const request = this.client.from('task').delete().eq('id', taskId);
  //   const request$ = from(request);

  //   return request$;
  // }

  // edit(id: number,title: string, description: string) {
  //   const data = {
  //     title,
  //     description
  //   }

  //   const request = this.client.from('task').update(data).eq('id', id);
  //   const request$ = from(request);

  //   return request$;
  // }

  // changeStatus(id: number, statusId: number) {
  //   const data = {
  //     status_id: statusId
  //   }
  //   const request = this.client.from('task').update(data).eq('id', id);
  //   const request$ = from(request);

  //   return request$;
  // }

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
          throw new Error(`error while fetching tasks: ${response.error}`);

        return response.data;
      })
    );

    return res;
  }

  getConsultationDetails(consultation: Consultation) {
    // const a = this.client.from()
  }
}
