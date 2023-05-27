import { Injectable, signal } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthResponse,
} from '@supabase/supabase-js';
import { BehaviorSubject, from, map, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { CapstoolUser } from '../models/capstool-user';
import { SupabaseService } from './supabase.service';
import { TitleAnalyzerResult } from '../models/titleAnalyzerResult';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  projects: {
    name: string;
    uid: number;
    description: string;
    members: string[];
  }[] = [
    {
      name: 'Capstool',
      uid: 0,
      description: 'project description example',
      members: ['Tanya Markova', 'Gardo Versoza', 'Zsa Zsa Padilla'],
    },
    {
      name: 'Capstool 2',
      uid: 1,
      description: 'project description example',
      members: ['Tanya Markova', 'Gardo Versoza', 'Zsa Zsa Padilla'],
    },
    {
      name: 'Capstool 3',
      uid: 1,
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

  // todo: rename this, remove "signal"
  activeProjectIdSignal = signal(-1);

  getProjects() {
    return this.projects;
  }

  // todo: make the backend services automatically restart when something fails

  // maybe rename this to backendService
  async analyzeTitle(title: string) {
    console.log('analyzing title:', title);
    const userId = '47033d78-0a18-4a0e-a5a5-1f9d51d04550'; // todo: get from logged in user
    const client = this.supabaseService.client;
    // todo: add types for edge fn
    const response = await client.functions.invoke('title-quality-checker', {
      body: {
        title,
        userId,
        name: 'Functions',
      },
    });
    const data = response.data as TitleAnalyzerResult;

    return data;
  }

  async generateForm(
    number: number,
    dateTime?: number,
    dateTimeRange?: number[]
  ) {
    const response = await this.supabase.functions.invoke('form-generator', {
      body: {
        formNumber: number,
        projectId: this.activeProjectIdSignal(),
        dateTime: 123,
        // todo: update the edge fn to accept dateTimeRange
        // why accept dateTimeRange? why not just output the form 4 without asking for range
        // dateTimeRange,
        name: 'Functions',
      },
    });
    const url = response.data;
    console.log('url:', response.data);

    this._formUrl$.next(url);
  }
}
