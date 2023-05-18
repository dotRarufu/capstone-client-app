import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthResponse,
} from '@supabase/supabase-js';
import { BehaviorSubject, from, map, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { CapstoolUser } from '../models/capstool-user';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  projects: {
    name: string;
    uid: string;
    description: string;
    members: string[];
  }[] = [
    {
      name: 'Capstool',
      uid: '0',
      description: 'project description example',
      members: ['Tanya Markova', 'Gardo Versoza', 'Zsa Zsa Padilla'],
    },
    {
      name: 'Capstool 2',
      uid: '213k-das2-fds3',
      description: 'project description example',
      members: ['Tanya Markova', 'Gardo Versoza', 'Zsa Zsa Padilla'],
    },
    {
      name: 'Capstool 3',
      uid: '213k-das2-fds3',
      description: 'project description example',
      members: ['Tanya Markova', 'Gardo Versoza', 'Zsa Zsa Padilla'],
    },
  ];
  supabase: SupabaseClient;
  private _formUrl$: BehaviorSubject<string> = new BehaviorSubject('');
  formUrl$ = this._formUrl$.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.supabase = createClient(
      environment.supabase_url,
      environment.supabase_key
    );
  }

  activeProjectId: string = '';

  getProjects() {
    return this.projects;
  }

  async generateForm(number: number, dateTime?: number, dateTimeRange?: number[]) {
    const response = await this.supabase.functions.invoke(
      'form-generator',
      {
        body: {
          formNumber: number,
          projectId: Number(this.activeProjectId),
          dateTime: 123,
          // todo: update the edge fn to accept dateTimeRange
          // why accept dateTimeRange? why not just output the form 4 without asking for range
          // dateTimeRange,
          name: 'Functions',
        },
      }
    );
    const url = response.data;
    console.log("url:", response.data);
  
    this._formUrl$.next(url);
  }
}
