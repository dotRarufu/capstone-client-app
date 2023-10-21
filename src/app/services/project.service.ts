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
  filter,
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
import getRoleName from '../utils/getRoleName';

export type AError = {
  name: string;
  message: string;
  isError: true;
};

export type PickledResult = {
  annual_category_uniqueness: {
    report: { category_id: number; title_id_list: number[] }[];
    score: number;
  };
  category_rarity: {
    report: { category_id: number; score: number }[];
    score: number;
  };
  readability: number;
  substantive_words: {
    count: number;
    words: string[];
  };
  title_uniqueness: number;
  title: string;
};

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  readonly client = supabaseClient;
  private formUrlSubject = new BehaviorSubject('');
  private projectUpdate$ = new BehaviorSubject(0);
  private newParticipant$ = new BehaviorSubject(0);
  private invitedParticipantUpdate$ = new BehaviorSubject(0);

  authService = inject(AuthService);

  getAdviserProjectRole(projectId: number, userUid: string) {
    const project$ = this.getProjectInfo(projectId).pipe(
      map((p) => {
        let res = '';
        if (p.capstone_adviser_id === userUid) res += 'c';
        if (p.technical_adviser_id === userUid) res += 't';

        if (res !== '') return res;

        throw new Error('User is not participant of the project');
      })
    );

    return project$;
  }

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
          case 5: {
            return this.getGenericAdviserProjects(user.uid);
          }

          default:
            console.log('Unknown user role:', user.role_id);
            throw new Error('cannt');
        }
      })
    );

    return this.projectUpdate$.pipe(
      switchMap((_) => merge(of(null), projects$))
    );
  }

  createProject(name: string, fullTitle: string, section: string) {
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

    // const section$ = user$.pipe(
    //   switchMap((user) => this.getUserSection(user.uid)),
    //   map((d) => {
    //     const { data } = errorFilter(d);

    //     if (data.length === 0) throw new Error('user has no section');

    //     return data[0].section_id;
    //   })
    // );

    const data = {
      name,
      full_title: fullTitle,
      // section_id: section,
      capstone_adviser_id: null,
      is_done: false,
      technical_adviser_id: null,
      section,
    };
    const req = this.client.from('project').insert(data).select('id').single();

    const insertRequest$ = from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data.id;
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

  getAdvisers(projectId: number) {
    const advisers = this.client
      .from('project')
      .select('capstone_adviser_id, technical_adviser_id')
      .eq('id', projectId)
      .single();

    return from(advisers).pipe(
      map((a) => {
        const { data } = errorFilter(a);

        return data;
      })
    );
  }

  // Todo: add takeUntilDestroyed pipe for users of this method
  getParticipants(projectId: number) {
    // used observables so participants can be immediately updated when  new participant is added.
    // only for student,fort he add participant button
    // not intended for realtime sync with db

    if (projectId < 0) return throwError(() => new Error('Invalid project id'));

    const res = this.newParticipant$.pipe(
      switchMap(() => {
        const students = this.client
          .from('member')
          .select('student_uid, role')
          .eq('project_id', projectId);

        const advisers$ = this.getAdvisers(projectId).pipe(
          switchMap((advisers) => {
            const ids: { id: string; role: string }[] = [];

            if (advisers.capstone_adviser_id !== null)
              ids.push({
                id: advisers.capstone_adviser_id,
                role: 'Capstone Adviser',
              });

            if (advisers.technical_adviser_id !== null)
              ids.push({
                id: advisers.technical_adviser_id,
                role: 'Technical Adviser',
              });

            if (ids.length === 0) return of([]);

            return forkJoin(
              ids.map(({ id, role }) =>
                this.authService
                  .getUser(id)
                  .pipe(map((u) => ({ ...u, projectRole: role })))
              )
            );
          })
        );
        const students$ = from(students).pipe(
          map((a) => {
            const { data } = errorFilter(a);

            return data;
          }),
          switchMap((ids) =>
            forkJoin(
              ids.map(({ student_uid, role }) =>
                this.authService
                  .getUser(student_uid)
                  .pipe(map((u) => ({ ...u, projectRole: role })))
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

  getMembers(projectId: number) {
    const req = this.client
      .from('member')
      .select('*')
      .eq('project_id', projectId);

    const req$ = from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      })
    );

    return req$;
  }

  getProjectTechnicalAdviser(projectId: number) {
    const req = this.client
      .from('project')
      .select('*')
      .eq('id', projectId)
      .single();

    return from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      })
    );
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

  addParticipant(userUid: string, projectId: number, roleId: number) {
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
    const roleMatchesTargetUser$ = this.authService.getUser(userUid).pipe(
      map((u) => {
        if ((roleId === 2 || roleId === 1) && u.role_id !== 5)
          throw new Error(`Cannot add user as ${getRoleName(roleId)}`);
      })
    );
    const sender$ = this.authService
      .getAuthenticatedUser()
      .pipe(filter(isNotNull));
    const role$ = this.authService.getUser(userUid);
    const isAlreadyInvited$ = from(
      this.client
        .from('project_invitation')
        .select('*')
        .eq('receiver_uid', userUid)
        .eq('role', roleId)
    ).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        if (data.length > 0) throw new Error('User is already invited');

        return false;
      })
    );
    const req$ = role$.pipe(
      switchMap(({ role_id }) => {
        if (role_id === 0)
          return this.addStudentMember(projectId, userUid).pipe(
            tap((_) => this.signalNewParticipant())
          );

        if (![5].includes(role_id)) throw new Error('unknon role');

        const addProjectAdviser$ = sender$.pipe(
          switchMap((sender) =>
            this.addProjectAdviser(sender.uid, userUid, projectId, roleId)
          ),
          tap((_) => this.signalInvitedParticipant())
        );

        return addProjectAdviser$;
      })
    );

    return isParticipant$.pipe(
      switchMap((_) => roleMatchesTargetUser$),
      switchMap((_) => isAlreadyInvited$),
      switchMap((_) => req$)
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

        if (![5].includes(user.role_id)) throw new Error('unknown user role');

        const data: { [x: string]: null } = {};
        const adviser = user.role_id === 1 ? 'capstone' : 'technical';
        data[`${adviser}_adviser_id`] = null;

        const adviserProjectRole$ = this.getAdviserProjectRole(
          projectId,
          user.uid
        );
        return adviserProjectRole$.pipe(
          switchMap((role) => {
            const data: { [x: string]: null } = {};

            if (['c', 'ct'].includes(role)) {
              data[`capstone_adviser_id`] = null;
            }

            if (['t', 'ct'].includes(role)) {
              data[`technical_adviser_id`] = null;
            }

            return from(
              this.client.from('project').update(data).eq('id', projectId)
            );
          })
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

  cancelInvitation(projectId: number, senderUid: string, receiverUid: string) {
    const req = this.client
      .from('project_invitation')
      .delete()
      .eq('project_id', projectId)
      .eq('sender_uid', senderUid)
      .eq('receiver_uid', receiverUid);
    const req$ = from(req).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);
        return statusText;
      }),
      tap((_) => this.signalInvitedParticipant())
    );

    return req$;
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

  changeParticipantRole(uid: string, projectId: number, role: string) {
    if (uid === '') return throwError(() => new Error('No user uid passed'));
    if (projectId < 0) return throwError(() => new Error('Invalid project id'));

    const req = this.client
      .from('member')
      .update({ role })
      .eq('student_uid', uid);
    const req$ = from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return res;
      }),
      tap((_) => this.signalNewParticipant())
    );

    return req$;
  }

  getInvitedParticipants(projectId: number) {
    const req = this.client
      .from('project_invitation')
      .select('*')
      .eq('project_id', projectId);

    const req$ = this.invitedParticipantUpdate$.asObservable().pipe(
      switchMap((_) => from(req)),
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      })
    );

    return req$;
  }

  getSections() {
    const req = this.client.from('distinct_section').select();
    const req$ = from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      })
    );

    return req$;
  }

  isUserCapstoneAdviser() {
    const user$ = this.authService
      .getAuthenticatedUser()
      .pipe(filter(isNotNull));

    const request$ = user$.pipe(
      filter((u) => u.role_id === 5),
      switchMap((u) =>
        this.client
          .from('project')
          .select('id')
          .eq('capstone_adviser_id', u.uid)
          .eq('is_done', false)
      ),
      map((res) => {
        const { data } = errorFilter(res);

        return data.map((d) => d.id).length;
      }),
      map((length) => length > 0)
    );

    return request$;
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
  private signalInvitedParticipant() {
    const old = this.invitedParticipantUpdate$.getValue();
    this.invitedParticipantUpdate$.next(old + 1);
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

  getGenericAdviserProjects(userUid: string) {
    const request = this.client
      .from('project')
      .select('id')
      .or(
        `capstone_adviser_id.eq.${userUid}, technical_adviser_id.eq.${userUid}`
      )
      .eq('is_done', false);

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
    if (projectRows.length === 0) return of([]);

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

          return names$;
        }),
        map((names) => ({
          name: p.name,
          id: p.id,
          section: p.section,
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

  // private getUserSection(uid: string) {
  //   const section = this.client
  //     .from('student_info')
  //     .select('section_id')
  //     .eq('uid', uid);

  //   return from(section);
  // }

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

  private addProjectAdviser(
    sender: string,
    receiver: string,
    projectId: number,
    roleId: number
  ) {
    const data = {
      project_id: projectId,
      receiver_uid: receiver,
      sender_uid: sender,
      role: roleId,
    };
    const invitationReq = this.client
      .from('project_invitation')
      .insert(data)
      .select('*');

    const invitationReq$ = from(invitationReq).pipe(
      map((r) => {
        const { data } = errorFilter(r);

        return data[0];
      }),
      switchMap(({ id }) => this.authService.sendNotification(2, id, receiver))
    );

    return invitationReq$;
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
  }

  // maybe rename this to backendService
  async analyzeTitle(title: string) {
    console.log('Analyzing title:', title);
    const userId = this.authService.getAuthenticatedUserGuaranteed().uid; // todo: get from logged in user
    const client = this.client;
    // todo: add types for edge fn
    const response = await client.functions.invoke('title-quality-checker', {
      body: {
        title,
        userId,
        name: 'Functions',
      },
    });
    console.log('Title analyzed:', response);
    const data = response.data as TitleAnalyzerResult | null;
    this._analyzerResult$.next(data);

    return data;
  }

  getTitleAnayzeResult(id: string) {
    const req = this.client
      .from('ai_service_request')
      .select('*')
      .eq('id', id)
      .single();

    return from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      }),
      // @ts-ignore
      map((data) => window.jsonpickle.decode(data.data) as PickledResult)
    );
  }

  getUsersTitleRequests(isFinished: boolean | null = null) {
    const user = this.authService.getAuthenticatedUserGuaranteed().uid;

    const req = isFinished === null ? this.client.from('ai_service_request').select('id').eq('sender', user)
      : isFinished ? this.client.from('ai_service_request').select('id').eq('sender', user).neq('data', null)
      : this.client
          .from('ai_service_request')
          .select('*')
          .eq('sender', user)
          .eq('data', null)

    return from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data.map((d) => d.id);
      })
    );
  }
}
