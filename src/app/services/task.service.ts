import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthResponse,
} from '@supabase/supabase-js';
import { BehaviorSubject, from, map, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { CapstoolUser } from '../models/capstool-user';
import { Database } from '../types/supabase';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { DatabaseService } from './database.service';
import { User } from '../types/collection';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly client;

  constructor(
    private supabaseService: SupabaseService,
    private databaseService: DatabaseService,
    private router: Router,
  ) {
   this.client = this.supabaseService.client
  }

  add() {}

  // or edit
  delete() {}

  edit() {}

  changeStatus() {}

  getTasks(statusId: number, projectId: number) { 
    const request = this.client.from('task').select('*').eq('status_id', statusId).eq('project_id', projectId);
    const request$ = from(request).pipe(
      map(response => {
        if (response.error) throw new Error(`error while fetching tasks: ${response.error}`)

        return response.data
      })
    );

    return request$;
  }
}
