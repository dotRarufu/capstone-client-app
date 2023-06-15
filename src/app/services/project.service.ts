import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, filter, map } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { SupabaseService } from './supabase.service';
import { TitleAnalyzerResult } from '../models/titleAnalyzerResult';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../models/project';

type AnalyzerResultError = string;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  projects: Project[] = [
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
    {
      name: 'Capstool 3',
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
  private _analyzerResult$ = new BehaviorSubject<
    TitleAnalyzerResult | AnalyzerResultError | undefined | null
  >(undefined);
  analyzerResult$ = this._analyzerResult$.asObservable().pipe(
    filter((v) => v !== undefined),
    map(this.checkError)
  );

  constructor(
    private supabaseService: SupabaseService,
    private toastr: ToastrService
  ) {
    this.supabase = createClient(
      environment.supabase_url,
      environment.supabase_key
    );
  }

  // todo: rename this, remove "signal"
  // make this default to -1
  activeProjectIdSignal = signal(0);

  getProjects() {
    return this.projects;
  }

  // todo: make the backend services automatically restart when something fails

  clearAnalyzerResult() {
    this._analyzerResult$.next(undefined);
    console.log('clear result');
  }

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
    const data = response.data as TitleAnalyzerResult | null;
    this._analyzerResult$.next(data);

    return data;
  }

  checkError(a: TitleAnalyzerResult | undefined | null | AnalyzerResultError) {
    if (a === undefined || a === null) {
      console.log('should show error toast');
      this.toastr.error('error occured while analyzing title');
      throw new Error('undefined result');
    }

    if (typeof a === 'string') throw new Error(a);

    return a;
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

    let url = '';
    switch (number) {
      case 1:
        url =
          response.data ||
          'https://iryebjmqurfynqgjvntp.supabase.co/storage/v1/object/public/chum-bucket/form_1_project_0.docx';
        break;
      case 2:
        url =
          response.data ||
          'https://iryebjmqurfynqgjvntp.supabase.co/storage/v1/object/public/chum-bucket/form_2_project_0.docx?t=2023-05-18T14%3A11%3A02.027Z';
        break;
      case 3:
        url =
          response.data ||
          'https://iryebjmqurfynqgjvntp.supabase.co/storage/v1/object/public/chum-bucket/form_3_project_0.docx';
        break;
      case 4:
        url =
          response.data ||
          'https://iryebjmqurfynqgjvntp.supabase.co/storage/v1/object/public/chum-bucket/form_4_project_0.docx';
        break;

      default:
        url =
          response.data ||
          'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
        break;
    }

    console.log('url:', response.data);

    this._formUrl$.next(url);
  }
}
