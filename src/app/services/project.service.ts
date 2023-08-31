import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  from,
  map,
  merge,
  of,
  switchMap,
  tap,
  zip,
  throwError,
  catchError,
  forkJoin,
} from 'rxjs';
import { TitleAnalyzerResult } from '../models/titleAnalyzerResult';
import { AuthService } from './auth.service';
import { ProjectRow } from '../types/collection';
import { Project } from '../models/project';
import { getObjectValues } from '../utils/getObjectValues';
import errorFilter from '../utils/errorFilter';
import supabaseClient from '../lib/supabase';
import { isNotNull } from '../utils/isNotNull';
import { checkObjectHasKeys } from '../utils/checkObjectHasKeys';
import { MilestoneService } from './milestone.service';

export type AError = {
  name: string;
  message: string;
  isError: true;
};

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  readonly client = supabaseClient;
  private formUrlSubject = new BehaviorSubject('');
  private projectUpdate$ = new BehaviorSubject(0);
  private newParticipant$ = new BehaviorSubject(0);

  authService = inject(AuthService);
  milestoneService = inject(MilestoneService);

  // Todo: add takeUntilDestroyed pipe for users of this method
  getProjects() {
    const user$ = this.authService.getAuthenticatedUser();

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
    const user$ = this.authService.getAuthenticatedUser().pipe(
      map((_) => {
        if (name === '' || fullTitle === '')
          throw new Error('You passed an empty string');

        return _;
      }),
      map((user) => {
        if (user === null) throw new Error('no logged in user');

        return user;
      })
    );

    const section$ = user$.pipe(
      switchMap((user) => this.getUserSection(user.uid)),
      map((d) => {
        const { data } = errorFilter(d);

        if (data.length === 0) throw new Error('user has no section');

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

  // Todo: add takeUntilDestroyed pipe for users of this method
  getParticipants(projectId: number) {
    // used observables so participants can be immediately updated when  new participant is added.
    // only for student,fort he add participant button
    // not intended for realtime sync with db

    const res = this.newParticipant$.pipe(
      map((_) => {
        if (projectId < 0) throw new Error('Invalid project id');
      }),
      switchMap(() => {
        const advisers = this.client
          .from('project')
          .select('capstone_adviser_id, technical_adviser_id')
          .eq('id', projectId);
        const students = this.client
          .from('member')
          .select('student_uid')
          .eq('project_id', projectId);

        const advisers$ = from(advisers).pipe(
          map((a) => {
            const { data } = errorFilter(a);

            return data[0];
          }),
          switchMap((advisers) => {
            const ids = [];

            if (advisers.capstone_adviser_id !== null)
              ids.push(advisers.capstone_adviser_id);

            if (advisers.technical_adviser_id !== null)
              ids.push(advisers.technical_adviser_id);

            return forkJoin(ids.map((id) => this.authService.getUser(id)));
          })
        );
        const students$ = from(students).pipe(
          map((a) => {
            const { data } = errorFilter(a);

            return data;
          }),
          switchMap((ids) =>
            forkJoin(
              ids.map(({ student_uid }) =>
                this.authService.getUser(student_uid)
              )
            )
          )
        );

        return merge(
          of(null),
          zip(students$, advisers$).pipe(map((a) => a.flat()))
        );
      })
    );

    return res;
  }

  checkProjectParticipant(userUid: string, projectId: number) {
    if (userUid === '') return throwError(() => new Error('User uid is empty'));

    if (projectId < 0)
      return throwError(() => new Error('Project id is invalid'));

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

    if (userUid === '')
      return throwError(() => new Error('No user uid passed'));
    if (projectId < 0) return throwError(() => new Error('Invalid project id'));

    const isParticipant$ = this.checkProjectParticipant(
      userUid,
      projectId
    ).pipe(
      map((isParticipant) => {
        if (isParticipant) throw new Error('participant already exists');

        return isParticipant;
      })
    );
    const role$ = this.authService.getUser(userUid);
    const req$ = role$.pipe(
      switchMap(({ role_id }) => {
        if (role_id === 0) return this.addStudentMember(projectId, userUid);

        if (![1, 2].includes(role_id)) throw new Error('unknon role');

        return this.addProjectAdviser(userUid, projectId, role_id as 1 | 2);
      })
    );

    return isParticipant$.pipe(
      switchMap((_) => req$),
      tap((_) => this.signalNewParticipant())
    );
  }

  removeProjectParticipant(
    userUid: string,
    projectId: number,
    isLeave?: boolean
  ) {
    if (userUid === '') return throwError(() => new Error('User uid is empty'));

    if (projectId < 0)
      return throwError(() => new Error('Project id is invalid'));

    const user$ = from(this.authService.getUser(userUid));

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
      switchMap((_) => this.deleteEmptyProject(projectId)),
      tap((_) => {
        if (!isLeave) {
          this.signalNewParticipant();
        }
      })
    );
  }

  removeProject(projectId: number) {
    if (projectId < 0)
      return throwError(() => new Error('Project id is invalid'));

    const user$ = this.authService.getAuthenticatedUser();
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

  updateGeneralInfo(projectId: number, data: Partial<ProjectRow>) {
    const req$ = of('').pipe(
      map((_) => {
        if (!checkObjectHasKeys(data)) throw new Error('empty data');
        if (data.full_title === '') throw new Error('empty full title');
        if (data.name === '') throw new Error('empty name');

        return _;
      }),
      switchMap((_) => {
        const req = this.client
          .from('project')
          .update(data)
          .eq('id', projectId)
          .select('*');

        return req;
      }),
      map((res) => {
        const { data } = errorFilter(res);

        return data[0];
      }),
      catchError((value) => {
        const err = value as Error;
        const res: AError = {
          name: err.name,
          message: err.message,
          isError: true,
        };
        return of(res);
      })
    );

    return req$;
  }

  getProjectInfo(projectId: number) {
    if (projectId < 0)
      return throwError(() => new Error('Project id is invalid'));

    const req = this.client.from('project').select('*').eq('id', projectId);
    const req$ = from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data[0];
      })
    );

    return req$;
  }

  deleteProject(projectId: number) {
    if (projectId < 0)
      return throwError(() => new Error('Project id is invalid'));

    const req = this.client.from('project').delete().eq('id', projectId);
    const req$ = from(req).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      })
    );
    return req$;
  }
  getArchived() {
    const user$ = this.authService.getAuthenticatedUser();
    return user$.pipe(
      map((res) => {
        if (res === null) throw new Error('im,podsai');

        return res;
      }),
      switchMap((user) => {
        const adviser =
          user.role_id === 1 ? 'capstone_adviser_id' : 'technical_adviser_id';
        const req = this.client
          .from('project')
          .select('*')
          .eq(adviser, user.uid)
          .eq('is_done', true);
        const req$ = from(req);

        return req$;
      }),
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      }),
      switchMap((projectRows) => this.getProject(projectRows))
    );
  }

  getProjectCount() {
    const response$ = from(
      this.client.from('capstone_projects').select('project_id')
    );
    const res$ = response$.pipe(
      map((res) => {
        const count = res.data?.length;

        if (!count)
          throw new Error(
            'wip, seomthing wrong occured while fetching project count'
          );

        return count;
      })
    );

    return res$;
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
      .eq('is_done', false)
      .eq('capstone_adviser_id', userUid);

    const projects$ = from(request).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        // return res.data.map((d) => d.id);
        return data;
      }),
      switchMap((projectRows) => this.getProject(projectRows))
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
      switchMap((projectRows) => this.getProject(projectRows))
    );

    return projects$;
  }

  private getTechnicalAdviserProjects(userUid: string) {
    const request = this.client
      .from('project')
      .select('id')
      .eq('is_done', false)
      .eq('technical_adviser_id', userUid);

    const projects$ = from(request).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data.map((d) => d.id);
      }),
      switchMap(async (projectIds) => await this.getProjectRows(projectIds)),
      switchMap((projectRows) => this.getProject(projectRows))
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

  private getProject(projectRows: ProjectRow[]) {
    const projects = projectRows.map((p) => {
      const projectMembers$ = from(this.getProjectMembers(p.id));
      const adviserIds: string[] = [];

      p.capstone_adviser_id !== null && adviserIds.push(p.capstone_adviser_id);
      p.technical_adviser_id !== null &&
        adviserIds.push(p.technical_adviser_id);

      return projectMembers$.pipe(
        map((members) => [...members.map((d) => d.student_uid), ...adviserIds]),
        switchMap((userIds) => {
          const names$ = forkJoin(
            userIds.map((id) => from(this.authService.getUser(id)))
          ).pipe(map((members) => members.map((m) => m.name)));
          const section$ = this.getSection(p.section_id);

          return forkJoin({ names: names$, section: section$ });
        }),
        map(({ names, section }) => ({
          name: p.name,
          id: p.id,
          sectionName: section,
          members: names,
          title: p.full_title,
          isDone: p.is_done,
        }))
      );
    });

    return forkJoin(projects);
  }

  private getSection(id: number) {
    const res = this.client.from('section').select('name').eq('id', id);
    const res$ = from(res).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data[0].name;
      })
    );

    return res$;
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

  private deleteEmptyProject(id: number) {
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
    let data: Partial<ProjectRow> = {
      technical_adviser_id: userUid,
    };

    if (role === 1) {
      data = {
        capstone_adviser_id: userUid,
      };
    }

    const update = this.client.from('project').update(data).eq('id', projectId);
    const update$ = from(update).pipe(
      map((r) => {
        const { statusText } = errorFilter(r);

        return statusText;
      })
    );

    return update$.pipe(
      switchMap((_) => this.applyCapstoneAdviserTemplate(userUid, projectId))
    );
  }

  private applyCapstoneAdviserTemplate(userUid: string, projectId: number) {
    console.log('called!');
    const templates$ = this.milestoneService.getMilestoneTemplates(userUid);
    const milestoneIds$ = from(
      this.client.from('milestone').select('id').eq('project_id', projectId)
    ).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      }),
      map((ids) => ids.map(({ id }) => id))
    );

    const deleteReq$ = milestoneIds$.pipe(
      switchMap((ids) => {
        const a = ids.map((id) => this.milestoneService.delete(id));

        if (ids.length === 0) return of([]);

        return forkJoin(a);
      })
    );
    const addReq$ = templates$.pipe(
      tap((_) => console.log('adds new milestones')),
      switchMap((templates) => {
        if (templates.length === 0) return of([]);

        const reqs$ = templates.map((t) =>
          this.milestoneService.add(projectId, {
            title: t.title,
            description: t.description,
            dueDate: t.due_date,
          })
        );

        return forkJoin(reqs$);
      })
    );

    return deleteReq$.pipe(switchMap((_) => addReq$));
  }

  // todo: make the backend services automatically restart when something fails

  // move this in user service
  private _analyzerResult$ = new BehaviorSubject<
    TitleAnalyzerResult | null | undefined
  >(undefined);
  analyzerResult$ = this._analyzerResult$.asObservable().pipe(
    map((d) => {
      if (d === null) throw new Error('err');
      return d;
    })
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
    console.log('response:', response);
    const data = response.data as TitleAnalyzerResult | null;
    this._analyzerResult$.next(data);
    console.log('emits:', data?.title_uniqueness);

    return data;
  }
}
