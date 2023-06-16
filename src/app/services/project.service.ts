import { Injectable, signal } from '@angular/core';
import {
  createClient,
  PostgrestSingleResponse,
  SupabaseClient,
} from '@supabase/supabase-js';
import {
  BehaviorSubject,
  filter,
  from,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { SupabaseService } from './supabase.service';
import { TitleAnalyzerResult } from '../models/titleAnalyzerResult';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { DatabaseService } from './database.service';
import { ProjectRow } from '../types/collection';
import { Project } from '../models/project';

type AnalyzerResultError = string;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  // projects: Project[] = [
  //   {
  //     name: 'Capstool',
  //     uid: 0,
  //     description: 'project description example',
  //     members: ['Tanya Markova', 'Gardo Versoza', 'Zsa Zsa Padilla'],
  //   },
  //   {
  //     name: 'Capstool 2',
  //     uid: 1,
  //     description: 'project description example',
  //     members: ['Tanya Markova', 'Gardo Versoza', 'Zsa Zsa Padilla'],
  //   },
  //   {
  //     name: 'Capstool 3',
  //     uid: 1,
  //     description: 'project description example',
  //     members: ['Tanya Markova', 'Gardo Versoza', 'Zsa Zsa Padilla'],
  //   },
  //   {
  //     name: 'Capstool 3',
  //     uid: 1,
  //     description: 'project description example',
  //     members: ['Tanya Markova', 'Gardo Versoza', 'Zsa Zsa Padilla'],
  //   },
  //   {
  //     name: 'Capstool 3',
  //     uid: 1,
  //     description: 'project description example',
  //     members: ['Tanya Markova', 'Gardo Versoza', 'Zsa Zsa Padilla'],
  //   },
  // ];
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
  private newProject$ = new BehaviorSubject<number>(0);

  constructor(
    private supabaseService: SupabaseService,
    private databaseService: DatabaseService,
    private toastr: ToastrService,
    private authService: AuthService
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
    const user = this.authService.getCurrentUser();

    if (user == null)
      throw new Error('cant get student projects, no user is signed in');

    const client = this.databaseService.client;

    const studentRequest = client
      .from('member')
      .select('project_id')
      .eq('student_uid', user.uid);

    const capstoneAdviserRequest = client
      .from('project')
      .select('id')
      .eq('capstone_adviser_id', user.uid);

    const technicalAdviserRequest = client
      .from('project')
      .select('id')
      .eq('technical_adviser_id', user.uid);

    let projects$;
    switch (user.role_id) {
      case 0: {
        projects$ = this.newProject$.pipe(
          switchMap(async (_) => await studentRequest),
          map((res) => {
            if (res.error !== null) {
              throw new Error('An error occurred while fetching projects | 0');
            }

            return res.data.map((d) => d.project_id);
          }),
          switchMap(
            async (projectIds) => await this.getProjectRows(projectIds)
          ),
          switchMap(async (projectRows) => await this.getProject(projectRows))
        );
        break;
      }

      case 1: {
        projects$ = this.newProject$.pipe(
          switchMap(async (_) => await capstoneAdviserRequest),
          map((res) => {
            if (res.error !== null) {
              throw new Error('An error occurred while fetching projects');
            }

            return res.data.map((d) => d.id);
          }),
          switchMap(
            async (projectIds) => await this.getProjectRows(projectIds)
          ),
          switchMap(async (projectRows) => await this.getProject(projectRows))
        );
        break;
      }
      case 2: {
        projects$ = this.newProject$.pipe(
          switchMap(async (_) => await technicalAdviserRequest),
          map((res) => {
            if (res.error !== null) {
              throw new Error('An error occurred while fetching projects');
            }

            return res.data.map((d) => d.id);
          }),
          switchMap(
            async (projectIds) => await this.getProjectRows(projectIds)
          ),
          switchMap(async (projectRows) => await this.getProject(projectRows))
        );
        break;
      }

      default:
        throw new Error('unknown user role');
    }

    return projects$;
  }

  createProject(name: string, fullTitle: string) {
    const client = this.databaseService.client;
    const user = this.authService.getCurrentUser();

    if (user === null) throw new Error('no logged in user');

    const section = client
      .from('student_info')
      .select('section_id')
      .eq('uid', user.uid);

    const section$ = from(section).pipe(
      map((d) => {
        if (d.error !== null) throw new Error('error while getting section');

        return d.data[0].section_id;
      })
    );

    const insertRequest$ = section$.pipe(
      switchMap(async (section) => {
        const data = {
          name,
          full_title: fullTitle,
          section_id: section,
          capstone_adviser_id: null,
          is_done: false,
          technical_adviser_id: null,
        };

        const res = await client.from('project').insert(data).select('id');

        if (res.error) throw new Error('error while inserting project');

        return res.data[0].id;
      }),
      // add self to the new project
      switchMap((projectId) => this.addProjectMember(projectId, user.uid)),
      tap((_) => this.signalNewProject())
    );

    return insertRequest$;
  }

  private signalNewProject() {
    const old = this.newProject$.getValue();
    this.newProject$.next(old + 1);
  }

  addProjectMember(projectId: number, studentUid: string) {
    const client = this.databaseService.client;
    const data = {
      project_id: projectId,
      student_uid: studentUid,
    };
    const insertRequest = client.from('member').insert(data);
    const insertRequest$ = from(insertRequest).pipe(
      map((d) => {
        if (d.error !== null) throw new Error('error inserting a member');

        return d.statusText;
      })
    );

    return insertRequest$;
  }

  private async getProjectRows(projectIds: number[]) {
    const client = this.databaseService.client;
    const projectRows: ProjectRow[] = await Promise.all(
      projectIds.map(async (id) => {
        const res = await client.from('project').select('*').eq('id', id);
        // todo: handle error
        if (res.error !== null) throw new Error('error while fetching project');

        return res.data[0];
      })
    );

    return projectRows;
  }

  private async getProject(projectRows: ProjectRow[]) {
    const projects: Project[] = await Promise.all(
      projectRows.map(async (p) => {
        const projectMembers = await this.getProjectMembers(p.id);

        if (projectMembers === 'this project has no members')
          return {
            name: p.name,
            uid: p.id,
            members: [projectMembers],
            title: p.full_title,
          };

        const userIds = projectMembers.map((d) => d.student_uid);
        const members = await Promise.all(
          userIds.map(async (id) => await this.getUser(id))
        );
        const memberNames = members.map((m) => m.name);

        // description -> full title
        // name -> 'Capstool'
        return {
          name: p.name,
          uid: p.id,
          members: memberNames,
          title: p.full_title,
        };
      })
    );

    return projects;
  }
  private async getProjectMembers(projectId: number) {
    const client = this.databaseService.client;
    const res = await client
      .from('member')
      .select('*')
      .eq('project_id', projectId);

    if (res.error !== null) {
      console.error('error while fetching member of a project');
      return 'this project has no members';
    }

    return res.data;
  }

  // todo: make the backend services automatically restart when something fails

  // move this in user service
  private async getUser(uid: string) {
    const client = this.databaseService.client;
    const res = await client.from('user').select('*').eq('uid', uid);

    if (res.error !== null) {
      console.error('error while fetching user');

      return {
        name: 'unregistered user',
        role_id: -1,
        uid: -1,
      };
    }

    return res.data[0];
  }

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
