import { Injectable, WritableSignal, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import {
  BehaviorSubject,
  Observable,
  filter,
  from,
  map,
  merge,
  of,
  switchMap,
  tap,
  zip,
} from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { SupabaseService } from './supabase.service';
import { TitleAnalyzerResult } from '../models/titleAnalyzerResult';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { DatabaseService } from './database.service';
import { ProjectRow } from '../types/collection';
import { Project } from '../models/project';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserService } from './user.service';
import { getObjectValues } from '../utils/getObjectValues';

type AnalyzerResultError = string;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  readonly client;
  private formUrlSubject: BehaviorSubject<string> = new BehaviorSubject('');
  private projectUpdate$ = new BehaviorSubject<number>(0);
  private newParticipant$ = new BehaviorSubject<number>(0);
  formUrl$ = this.formUrlSubject.asObservable();
  activeProjectId: WritableSignal<number>;

  constructor(
    private supabaseService: SupabaseService,
    private databaseService: DatabaseService,
    private toastr: ToastrService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.client = this.databaseService.client;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: (_) => {
          const child1 = this.route.firstChild;

          if (child1 === null) return;

          if (child1.snapshot.url.length !== 0) {
            const child1Path = child1.snapshot.url[0].path;

            if (['s', 'a'].includes(child1Path)) {
              const child2 = child1.children[0];
              const child2Path = child2.snapshot.url[0].path;

              if (child2Path === 'project') {
                const id = child2.children[0].snapshot.url[0].path;

                this.activeProjectId.set(Number(id));

                return;
              }
            }
          }

          console.log('not llogged in, no project id to get');
        },
      });

    this.activeProjectId = signal(-1);
  }

  // todo: maybe create an active project subject instead of this method
  getCurrentTechnicalAdviserId() {
    const request = this.client
      .from('project')
      .select('technical_adviser_id')
      .eq('id', this.activeProjectId());

    const request$ = from(request).pipe(
      map((res) => {
        if (res.error !== null)
          throw new Error('error getting technical adviseri d');

        return res.data[0].technical_adviser_id;
      })
    );

    return request$;
  }

  private getStudentProjects(userUid: string) {
    const studentRequest = this.client
      .from('member')
      .select('project_id')
      .eq('student_uid', userUid);

    const projects$ = from(studentRequest).pipe(
      map((res) => {
        if (res.error !== null) {
          throw new Error('An error occurred while fetching projects | 0');
        }

        return res.data.map((d) => d.project_id);
      }),
      switchMap((projectIds) => from(this.getProjectRows(projectIds))),
      switchMap((projectRows) => from(this.getProject(projectRows)))
    );

    return projects$;
  }

  private getCapstoneAdviserProjects(userUid: string) {
    const request = this.client
      .from('project')
      .select('*')
      .eq('capstone_adviser_id', userUid);

    const projects$ = from(request).pipe(
      map((res) => {
        if (res.error !== null) {
          throw new Error('An error occurred while fetching projects');
        }

        // return res.data.map((d) => d.id);
        return res.data;
      }),
      switchMap(async (projectRows) => await this.getProject(projectRows))
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
        if (res.error !== null) {
          throw new Error('An error occurred while fetching projects');
        }

        return res.data.map((d) => d.id);
      }),
      switchMap(async (projectIds) => await this.getProjectRows(projectIds)),
      switchMap(async (projectRows) => await this.getProject(projectRows))
    );

    return projects$;
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
            console.log("unknown user role:", user.role_id);
            throw new Error('cannt');
        }
      })
    );

    return this.projectUpdate$.pipe(
      switchMap((_) => merge(of(null), projects$))
    );
  }

  private getUserSection(uid: string) {
    const section = this.client
      .from('student_info')
      .select('section_id')
      .eq('uid', uid);

    return from(section);
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

  getParticipants() {
    // used observables so participants can be immediately updated when  new participant is added.
    // only for student,fort he add participant button
    // not intended for realtime sync with db

    const advisers = this.client
      .from('project')
      .select('capstone_adviser_id, technical_adviser_id')
      .eq('id', this.activeProjectId());
    const students = this.client
      .from('member')
      .select('student_uid')
      .eq('project_id', this.activeProjectId());

    const advisers$ = from(advisers).pipe(
      map((a) => {
        if (a.error !== null)
          throw new Error('error while fetching adviser participants');

        return a.data[0];
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
        if (a.error !== null)
          throw new Error('error while fetching student participants');

        return a.data;
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

  checkProjectParticipant(userUid: string, projectId?: number) {
    const advisersCheck = this.client
      .from('project')
      .select('capstone_adviser_id, technical_adviser_id')
      .eq('id', projectId ?? this.activeProjectId());
    const advisersId$ = from(advisersCheck).pipe(
      map((a) => {
        if (a.error !== null) throw new Error('error fetching project');

        const adviserIds = getObjectValues<string | null>(a.data[0]);

        return adviserIds.filter((id) => id !== null);
      }),
    );
    const studentsCheck = this.client
      .from('member')
      .select('student_uid')
      .eq('project_id', projectId || this.activeProjectId());
    const studentIds$ = from(studentsCheck).pipe(
      map((a) => {
        if (a.error !== null) throw new Error('error fetching project');

        return a.data.map((a) => a.student_uid);
      })
    );

    const isUserParticipant$ = zip(studentIds$, advisersId$).pipe(
      map((a) => a.flat()),
      map((ids) => ids.includes(userUid))
    );

    return isUserParticipant$;
  }

  addParticipant(role: number, userUid: string, projectId: number) {
    let res: Observable<string>;
    // todo: if the adviser already exist, notify user that they are replacing the adviser by adding new adviser

    switch (role) {
      case 0:
        res = from(this.userService.getUser(userUid)).pipe(
          map((user) => {
            if (user.role_id !== role)
              throw new Error(
                `${user.name} cannot be added to a project as role ${user.role_id}`
              );

            return user;
          }),
          switchMap((_) => this.addStudentMember(projectId, userUid)),
          tap((_) => this.signalNewParticipant())
        );
        break;

      case 1: {
        // todo: add remove adviser
        const data = {
          capstone_adviser_id: userUid,
        };
        const update = this.client
          .from('project')
          .update(data)
          .eq('id', projectId);
        const update$ = from(update).pipe(
          map((r) => {
            if (r.error !== null)
              throw new Error('error while updating project');

            return r.statusText;
          })
        );

        res = from(this.userService.getUser(userUid)).pipe(
          map((user) => {
            if (user.role_id !== role)
              throw new Error(
                `${user.name} cannot be added to a project as role ${user.role_id}`
              );

            return user;
          }),
          switchMap((_) => update$),
          tap((_) => this.signalNewParticipant())
        );
        break;
      }
      case 2: {
        const data = {
          technical_adviser_id: userUid,
        };
        const update = this.client
          .from('project')
          .update(data)
          .eq('id', projectId);
        const update$ = from(update).pipe(
          map((r) => {
            // todo: create funtion for this, and use it on others
            if (r.error !== null)
              throw new Error('error while updating project');

            return r.statusText;
          })
        );

        res = from(this.userService.getUser(userUid)).pipe(
          map((user) => {
            if (user.role_id !== role)
              throw new Error(
                `${user.name} cannot be added to a project as role ${user.role_id}`
              );

            return user;
          }),
          switchMap((_) => update$),
          tap((_) => this.signalNewParticipant())
        );
        break;
      }
      default:
        throw new Error('unknown user role');
    }

    // should complete immediately
    return of('').pipe(
      switchMap((_) => this.checkProjectParticipant(userUid)),
      map((isParticipant) => {
        if (isParticipant) throw new Error('participant already exists');
        console.log('isParticipant:', isParticipant);

        return isParticipant;
      }),
      switchMap((_) => res)
    );
  }

  private deleteProject(id: number) {
    const members = this.client.from('member').select('*').eq('project_id', id);
    const members$ = from(members).pipe(
      map((res) => {
        if (res.error !== null) throw new Error('error getting members');

        return res.data;
      }),
      filter((members) => members.length === 0),
      switchMap((_) => from(this.client.from('project').delete().eq('id', id)))
    );

    return members$;
  }

  removeProjectParticipant(userUid: string, projectId: number) {
    return from(this.userService.getUser(userUid)).pipe(
      switchMap((user) => {
        if (user.role_id === 0) {
          return from(
            this.client
              .from('member')
              .delete()
              .eq('student_uid', user.uid)
              .eq('project_id', projectId)
          ).pipe(
            switchMap((_) => this.deleteProject(projectId)),
            tap((_) => this.signalProjectUpdate())
          );
        } else if (user.role_id === 1) {
          const data = {
            capstone_adviser_id: null,
          };
          return from(
            this.client.from('project').update(data).eq('id', projectId)
          ).pipe(tap((_) => this.signalProjectUpdate()));
        } else if (user.role_id === 2) {
          const data = {
            technical_adviser_id: null,
          };
          return from(
            this.client.from('project').update(data).eq('id', projectId)
          ).pipe(tap((_) => this.signalProjectUpdate()));
        }

        throw new Error('unknown role');
      }),
      map((res) => {
        if (res.error !== null) throw new Error('error updating project');

        return res.statusText;
      })
    );
  }

  removeProject(projectId: number) {
    const user$ = from(this.authService.getAuthenticatedUser());

    const request$ = user$.pipe(
      map((user) => {
        if (user === null) throw new Error('this should be impossible');

        return user;
      }),
      switchMap((user) => this.removeProjectParticipant(user.uid, projectId))
    );

    return request$;
  }

  private signalProjectUpdate() {
    const old = this.projectUpdate$.getValue();
    this.projectUpdate$.next(old + 1);
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
        if (d.error !== null) throw new Error('error inserting a member');

        return d.statusText;
      })
    );

    return insertRequest$;
  }

  private async getProjectRows(projectIds: number[]) {
    const projectRows: ProjectRow[] = await Promise.all(
      projectIds.map(async (id) => {
        const res = await this.client.from('project').select('*').eq('id', id);
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
        const section = await this.getSection(p.section_id);

        if (projectMembers === 'this project has no members')
          return {
            name: p.name,
            id: p.id,
            members: [projectMembers],
            sectionName: section,
            title: p.full_title,
          };

        const adviserIds = [];
        if (p.capstone_adviser_id !== null)
          adviserIds.push(p.capstone_adviser_id);
        if (p.technical_adviser_id !== null)
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

  // todo: move in db service
  private async getSection(id: number) {
    const res = await this.client.from('section').select('name').eq('id', id);
    if (res.error !== null) throw new Error('error getting section');

    return res.data[0].name;
  }

  private async getProjectMembers(projectId: number) {
    const res = await this.client
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
