import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthResponse,
  PostgrestSingleResponse,
} from '@supabase/supabase-js';
import { BehaviorSubject, Observable, forkJoin, from, map, merge, mergeAll, mergeMap, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { CapstoolUser } from '../models/capstool-user';
import { Database } from '../types/supabase';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { DatabaseService } from './database.service';
import { Consultation, Task, User } from '../types/collection';
import { getCurrentEpochTime } from '../utils/getCurrentEpochTime';
import { ConsultationData } from '../models/consultationData';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {
  private readonly client;

  constructor(
    private supabaseService: SupabaseService,
    private userService: UserService,
    private authService: AuthService,
    private projectService: ProjectService
  ) {
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

  scheduleConsultation(data: ConsultationData, projectId: number) {
    const user = this.authService.getCurrentUser();

    if (user === null) throw new Error('must be impossible');

    const request$ = this.insertConsultation(user.uid, data, projectId);
    
    return request$;
  }

  // todo: maybe move in db service
  private insertConsultation(
    userUid: string,
    data: ConsultationData,
    projectId: number,
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
      switchMap(id => this.insertAccomplishedTasks(id, data.taskIds))
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
