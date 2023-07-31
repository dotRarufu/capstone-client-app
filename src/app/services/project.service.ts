import { Injectable, WritableSignal, signal } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  from,
  map,
  merge,
  of,
  switchMap,
  tap,
  zip,
  forkJoin,
  retry,
  Observable,
  throwError,
  first,
} from 'rxjs';
import { TitleAnalyzerResult } from '../models/titleAnalyzerResult';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { DatabaseService } from './database.service';
import { ProjectRow } from '../types/collection';
import { Project } from '../models/project';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserService } from './user.service';
import { getObjectValues } from '../utils/getObjectValues';
import errorFilter from '../utils/errorFilter';
import { isNotNull } from '../student/utils/isNotNull';
import supabaseClient from '../lib/supabase';
import { toObservable } from '@angular/core/rxjs-interop';

type AnalyzerResultError = string;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  readonly client = supabaseClient;
  private formUrlSubject: BehaviorSubject<string> = new BehaviorSubject('');
  private projectUpdate$ = new BehaviorSubject<number>(0);
  private newParticipant$ = new BehaviorSubject<number>(0);
  formUrl$ = this.formUrlSubject.asObservable();
  
 

  constructor(
    private databaseService: DatabaseService,
    private toastr: ToastrService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
   
  }
 
  getProjects() {
    const user$ = from(this.authService.getAuthenticatedUser());

    const projects$ = user$.pipe(
      map((user) => {
        if (user === null) throw new Error('cant');

        return user;
      }),
      switchMap((user) => {
        switch (user.role_id) {
          case 0: {
            return this.getStudentProjects(user.uid);
          }
          case 1: {
            return this.getCapstoneAdviserProjects(user.uid);
          }
          case 2: {
            return this.getTechnicalAdviserProjects(user.uid);
          }

          default:
            console.log('unknown user role:', user.role_id);
            throw new Error('cannt');
        }
      })
    );

    return this.projectUpdate$.pipe(
      switchMap((_) => merge(of(null), projects$))
    );
  }

  createProject(name: string, fullTitle: string) {
    const user$ = from(this.authService.getAuthenticatedUser()).pipe(
      map((user) => {
        if (user === null) throw new Error('no logged in user');

        return user;
      })
    );

    const section$ = user$.pipe(
      switchMap((user) => this.getUserSection(user.uid)),
      map((d) => {
        const { data } = errorFilter(d);

        return data[0].section_id;
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

        const res = await this.client.from('project').insert(data).select('id');

        if (res.error) throw new Error('error while inserting project');

        return res.data[0].id;
      }),
      // add self to the new project
      switchMap((projectId) =>
        user$.pipe(
          switchMap((user) => this.addStudentMember(projectId, user.uid))
        )
      ),
      tap((_) => this.signalProjectUpdate())
    );

    return insertRequest$;
  }

  getParticipants(projectId: number) {
    // used observables so participants can be immediately updated when  new participant is added.
    // only for student,fort he add participant button
    // not intended for realtime sync with db

    const advisers = this.client
      .from('project')
      .select('capstone_adviser_id, technical_adviser_id')
      .eq('id', projectId);
    const students = this.client
      .from('member')
      .select('student_uid')
      .eq('project_id', projectId);

    const advisers$ = from(advisers).pipe(
      tap((a) => {
        console.log('a:', a);
      }),
      map((a) => {
        const { data } = errorFilter(a);

        return data[0];
      }),
      switchMap(async (advisers) => {
        const ids = [];

        if (advisers.capstone_adviser_id !== null)
          ids.push(advisers.capstone_adviser_id);

        if (advisers.technical_adviser_id !== null)
          ids.push(advisers.technical_adviser_id);

        return await Promise.all(ids.map((id) => this.userService.getUser(id)));
      })
    );

    const students$ = from(students).pipe(
      map((a) => {
        const { data } = errorFilter(a);

        return data;
      }),
      switchMap(
        async (ids) =>
          await Promise.all(
            ids.map(({ student_uid }) => this.userService.getUser(student_uid))
          )
      )
    );

    return this.newParticipant$.pipe(
      switchMap((_) =>
        merge(of(null), zip(students$, advisers$).pipe(map((a) => a.flat())))
      )
    );
  }

  checkProjectParticipant(userUid: string, projectId: number) {
    const adviser = this.client
      .from('project')
      .select('capstone_adviser_id, technical_adviser_id')
      .eq('id', projectId);

    const advisersId$ = from(adviser).pipe(
      map((a) => {
        const { data } = errorFilter(a);
        const adviserIds = getObjectValues<string | null>(data[0]);

        return adviserIds.filter((id) => id !== null);
      })
    );

    const students = this.client
      .from('member')
      .select('student_uid')
      .eq('project_id', projectId);

    const studentIds$ = from(students).pipe(
      map((a) => {
        const { data } = errorFilter(a);

        return data.map((a) => a.student_uid);
      })
    );

    const isUserParticipant$ = zip(studentIds$, advisersId$).pipe(
      map((a) => a.flat()),

      map((ids) => ids.includes(userUid))
    );

    return isUserParticipant$;
  }

  addParticipant(userUid: string, projectId: number) {
    // todo: if the adviser already exist, notify user that they are replacing the adviser by adding new adviser

    const role$ = from(this.userService.getUser(userUid));

    const newParticipant$ = role$.pipe(
      switchMap(({ role_id }) => {
        if (role_id === 0)
          return from(this.userService.getUser(userUid)).pipe(
            switchMap((_) => this.addStudentMember(projectId, userUid)),
            tap((_) => this.signalNewParticipant())
          );

        if (![1, 2].includes(role_id)) throw new Error('unknon role');

        return this.addProjectAdviser(userUid, projectId, role_id as 1 | 2);
      })
    );

    return of('').pipe(
      switchMap((_) => this.checkProjectParticipant(userUid, projectId)),
      map((isParticipant) => {
        if (isParticipant) throw new Error('participant already exists');

        return isParticipant;
      }),
      switchMap((_) => newParticipant$),
      tap((_) => this.signalNewParticipant())
    );
  }

  removeProjectParticipant(userUid: string, projectId: number) {
    const user$ = from(this.userService.getUser(userUid));

    return user$.pipe(
      switchMap((user) => {
        if (user.role_id === 0) {
          return this.removeStudent(user.uid, projectId);
        }

        if (![1, 2].includes(user.role_id))
          throw new Error('unknown user role');

        const data: { [x: string]: null } = {};
        const adviser = user.role_id === 1 ? 'capstone' : 'technical';
        data[`${adviser}_adviser_id`] = null;

        return from(
          this.client.from('project').update(data).eq('id', projectId)
        );
      }),
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      switchMap((_) => this.deleteProject(projectId)),
      tap((_) => this.signalNewParticipant())
    );
  }

  removeProject(projectId: number) {
    const user$ = from(this.authService.getAuthenticatedUser());
    const request$ = user$.pipe(
      map((user) => {
        if (user === null) throw new Error('this should be impossible');

        return user;
      }),

      switchMap((user) => this.removeProjectParticipant(user.uid, projectId)),

      tap((_) => this.signalProjectUpdate())
    );
    return request$;
  }

  updateGeneralInfo(projectId: number, data: {}) {
    console.log("update with data:", data)
    const req = this.client.from("project").update(data).eq("id", projectId).select("*");

    const req$ = from(req).pipe(
      map(res => {
        const {data} = errorFilter(res);

        return data[0]
      })
    )

    return req$;
  }

  getProjectInfo(projectId: number) {
    const req = this.client.from("project").select("*").eq("id", projectId);
    const req$ = from(req).pipe(
      map(res => {
        const { data } = errorFilter(res);

        return data[0];
      })
    );

    return req$;
  }

  async getProjectsFromCategory(categoryId: number) {
    const projectIds = (
      await this.client
        .from('category_projects')
        .select('project_id')
        .eq('category_id', categoryId)
    ).data;

    const getTitles = async (id: number) =>
      (
        await this.client
          .from('capstone_projects')
          .select('title')
          .eq('project_id', id)
      ).data;

    if (!projectIds)
      throw new Error(`wip, no project found with category ${categoryId}`);

    const titles = (
      await Promise.all(
        projectIds.map(async ({ project_id }) => await getTitles(project_id))
      )
    )
      .filter(isNotNull)
      .flat()
      .map((a) => a.title);

    return titles;
  }

  private getCapstoneAdviserProjects(userUid: string) {
    const request = this.client
      .from('project')
      .select('*')
      .eq('capstone_adviser_id', userUid);

    const projects$ = from(request).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        // return res.data.map((d) => d.id);
        return data;
      }),
      switchMap(async (projectRows) => await this.getProject(projectRows))
    );

    return projects$;
  }

  private signalProjectUpdate() {
    const old = this.projectUpdate$.getValue();
    this.projectUpdate$.next(old + 1);
  }

  private getStudentProjects(userUid: string) {
    const studentRequest = this.client
      .from('member')
      .select('project_id')
      .eq('student_uid', userUid);

    const projects$ = from(studentRequest).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data.map((d) => d.project_id);
      }),
      switchMap((projectIds) => from(this.getProjectRows(projectIds))),
      switchMap((projectRows) => from(this.getProject(projectRows)))
    );

    return projects$;
  }

  private getTechnicalAdviserProjects(userUid: string) {
    const request = this.client
      .from('project')
      .select('id')
      .eq('technical_adviser_id', userUid);

    const projects$ = from(request).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data.map((d) => d.id);
      }),
      switchMap(async (projectIds) => await this.getProjectRows(projectIds)),
      switchMap(async (projectRows) => await this.getProject(projectRows))
    );

    return projects$;
  }

  private signalNewParticipant() {
    const old = this.newParticipant$.getValue();
    this.newParticipant$.next(old + 1);
  }

  private addStudentMember(projectId: number, studentUid: string) {
    const data = {
      project_id: projectId,
      student_uid: studentUid,
    };
    const insertRequest = this.client.from('member').insert(data);
    const insertRequest$ = from(insertRequest).pipe(
      map((d) => {
        const { statusText } = errorFilter(d);

        return statusText;
      })
    );

    return insertRequest$;
  }

  private async getProjectRows(projectIds: number[]) {
    const projectRows: ProjectRow[] = await Promise.all(
      projectIds.map(async (id) => {
        const res = await this.client.from('project').select('*').eq('id', id);

        const { data } = errorFilter(res);

        return data[0];
      })
    );

    return projectRows;
  }

  private async getProject(projectRows: ProjectRow[]) {
    const projects: Project[] = await Promise.all(
      projectRows.map(async (p) => {
        const projectMembers = await this.getProjectMembers(p.id);
        const section = await this.databaseService.getSection(p.section_id);
        const adviserIds = [];

        p.capstone_adviser_id !== null &&
          adviserIds.push(p.capstone_adviser_id);
        p.technical_adviser_id !== null &&
          adviserIds.push(p.technical_adviser_id);

        const userIds = [
          ...projectMembers.map((d) => d.student_uid),
          ...adviserIds,
        ];
        const members = await Promise.all(
          userIds.map(async (id) => await this.userService.getUser(id))
        );
        const memberNames = members.map((m) => m.name);

        // description -> full title
        // name -> 'Capstool'
        return {
          name: p.name,
          id: p.id,
          sectionName: section,
          members: memberNames,
          title: p.full_title,
        };
      })
    );

    return projects;
  }

  private getUserSection(uid: string) {
    const section = this.client
      .from('student_info')
      .select('section_id')
      .eq('uid', uid);

    return from(section);
  }

  private async getProjectMembers(projectId: number) {
    const res = await this.client
      .from('member')
      .select('*')
      .eq('project_id', projectId);

    const { data } = errorFilter(res);

    return data;
  }

  private removeStudent(uid: string, projectId: number) {
    const a = from(
      this.client
        .from('member')
        .delete()
        .eq('student_uid', uid)
        .eq('project_id', projectId)
    );

    return a;
  }

  private deleteProject(id: number) {
    const members = this.client.from('member').select('*').eq('project_id', id);
    const members$ = from(members).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      }),

      switchMap((members) => {
        if (members.length === 0) {
          return from(this.client.from('project').delete().eq('id', id)).pipe(
            map((res) => {
              const { statusText } = errorFilter(res);

              return statusText;
            })
          );
        }

        return of('');
      })
    );

    return members$;
  }

  private addProjectAdviser(userUid: string, projectId: number, role: 1 | 2) {
    const data =
      role === 1
        ? {
            capstone_adviser_id: userUid,
          }
        : {
            technical_adviser_id: userUid,
          };

    const update = this.client.from('project').update(data).eq('id', projectId);
    const update$ = from(update).pipe(
      map((r) => {
        const { statusText } = errorFilter(r);

        return statusText;
      })
    );

    return from(this.userService.getUser(userUid)).pipe(
      switchMap((_) => update$)
    );
  }

  // todo: make the backend services automatically restart when something fails

  // move this in user service
  private _analyzerResult$ = new BehaviorSubject<
    TitleAnalyzerResult | AnalyzerResultError | undefined | null
  >(undefined);
  analyzerResult$ = this._analyzerResult$.asObservable().pipe(
    filter((v) => v !== undefined),
    map(this.checkError)
  );
  clearAnalyzerResult() {
    this._analyzerResult$.next(undefined);
    console.log('clear result');
  }

  // maybe rename this to backendService
  async analyzeTitle(title: string) {
    console.log('analyzing title:', title);
    const userId = '47033d78-0a18-4a0e-a5a5-1f9d51d04550'; // todo: get from logged in user
    const client = this.client;
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

  generateForm(number: number, dateTime?: number, dateTimeRange?: number[]) {
    // const response = await this.supabase.functions.invoke('form-generator', {
    //   body: {
    //     formNumber: number,
    //     projectId: this.activeProjectId(),
    //     dateTime: 123,
    //     // todo: update the edge fn to accept dateTimeRange
    //     // why accept dateTimeRange? why not just output the form 4 without asking for range
    //     // dateTimeRange,
    //     name: 'Functions',
    //   },
    // });

    let url = '';
    switch (number) {
      case 1:
        url =
          // response.data ||
          'https://iryebjmqurfynqgjvntp.supabase.co/storage/v1/object/public/chum-bucket/form_1_project_0.docx';
        break;
      case 2:
        url =
          // response.data ||
          'https://iryebjmqurfynqgjvntp.supabase.co/storage/v1/object/public/chum-bucket/form_2_project_0.docx?t=2023-05-18T14%3A11%3A02.027Z';
        break;
      case 3:
        url =
          // response.data ||
          'https://iryebjmqurfynqgjvntp.supabase.co/storage/v1/object/public/chum-bucket/form_3_project_0.docx';
        break;
      case 4:
        url =
          // response.data ||
          'https://iryebjmqurfynqgjvntp.supabase.co/storage/v1/object/public/chum-bucket/form_4_project_0.docx';
        break;

      default:
        url =
          // response.data ||
          'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
        break;
    }

    // console.log('url:', response.data);

    return of(url).pipe(tap((url) => this.formUrlSubject.next(url)));
  }
}
