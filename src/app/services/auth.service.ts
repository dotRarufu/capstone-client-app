import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  from,
  map,
  filter,
  of,
  switchMap,
  tap,
  throwError,
  catchError,
} from 'rxjs';
import { Router } from '@angular/router';
import { ProjectRow, User } from '../types/collection';
import supabaseClient from '../lib/supabase';
import errorFilter from '../utils/errorFilter';
import { NgxSpinnerService } from 'ngx-spinner';
import { isNotNull } from '../utils/isNotNull';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private readonly client = supabaseClient;
  private readonly updateUserProfileSubject = new BehaviorSubject(0);
  private readonly updateNotificationsSubject = new BehaviorSubject(0);
  private readonly updateAvailableSchedulesSubject = new BehaviorSubject(0);
  user$ = this.userSubject.asObservable();
  updateUserProfile$ = this.updateUserProfileSubject.asObservable();
  updateNotifications$ = this.updateNotificationsSubject.asObservable();
  updateAvailableSchedules$ =
    this.updateAvailableSchedulesSubject.asObservable();
  // todo: should these use readonly?
  private router = inject(Router);
  private spinner = inject(NgxSpinnerService);

  authStateChange = this.client.auth.onAuthStateChange((event, session) => {
    console.log('EVENT:', event);

    // todo: turn to switch

    if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      this.userSubject.next(null);
      this.router.navigate(['']);
      this.spinner.hide();
    }
  });

  a = this.updateNotifications$.subscribe({
    next: () => console.log('emits inside srvie!'),
    complete: () => console.log('completes inside service!'),
  });

  getAuthenticatedUser() {
    const currentUser = this.getCurrentUser();

    if (currentUser !== null) return of(currentUser);

    const authenticatedUser$ = from(this.client.auth.getUser()).pipe(
      map((response) => response.data.user),
      switchMap((user) => {
        if (user === null) return of(null);

        const user$ = from(
          this.client.from('user').select('*').eq('uid', user.id).single()
        ).pipe(
          tap((_) => this.updateCurrentUser(user.id)),
          map((res) => {
            const { data } = errorFilter(res);

            return data;
          })
        );

        return user$;
      })
    );

    return authenticatedUser$;
  }

  getUserProfile(uid: string) {
    const user$ = this.updateUserProfile$.pipe(
      switchMap((__) => this.getUser(uid))
    );
    const email$ = from(this.client.auth.getUser()).pipe(
      map((res) => {
        if (res.error !== null) throw new Error('error getting user email');

        return res.data.user.email;
      })
    );

    return this.updateUserProfile$.pipe(
      switchMap((_) => combineLatest([user$, email$])),
      map(([user, email]) => ({ ...user, email }))
    );
  }

  login(email: string, password: string) {
    const client = supabaseClient.auth;
    const login = client.signInWithPassword({
      email,
      password,
    });
    const login$ = from(login).pipe(
      switchMap((authRes) => {
        if (!authRes.data.user) throw Error('wip, auth res user is undefined');

        return this.getUserData(authRes.data.user.id);
      }),
      tap((user) => this.userSubject.next(user))
    );

    return login$;
  }

  signUp(
    email: string,
    password: string,
    userInfo: { name: string; roleId: number; studentNumber: string }
  ) {
    const signUp = this.client.auth.signUp({
      email,
      password,
    });
    const signUp$ = from(signUp).pipe(
      map((authRes) => {
        if (authRes.error) {
          throw new Error(authRes.error.message);
        }
        if (authRes.data.user == null) throw new Error('Sign up failed');

        return authRes.data.user;
      }),
      switchMap((user) => this.updateUserData(user.id, userInfo)),
      switchMap((user) =>
        this.createStudentInfo(user.uid, userInfo.studentNumber)
      )
    );

    return signUp$;
  }

  getUserData(userUid: string) {
    if (userUid === '') return throwError(() => new Error('user is null'));

    const userRow$ = from(
      this.client.from('user').select('*').eq('uid', userUid).single()
    );

    const userData$ = userRow$.pipe(
      map((userRow) => {
        if (userRow.data == null)
          throw new Error(
            `no found row for user id ${userUid} even though user was able to log in`
          );

        return userRow.data;
      }),
      map((data) => {
        const { name, role_id, avatar_last_update } = data;

        if (!name) throw new Error('wip, name is undefined');
        if (role_id === null) throw new Error('wip, roleId is undefined');

        const res: User = { avatar_last_update, role_id, name, uid: userUid };

        return res;
      })
    );

    return userData$;
  }

  signOut() {
    const signOut = supabaseClient.auth.signOut();
    const signOut$ = from(signOut);

    return signOut$;
  }

  updateName(name: string) {
    const userUid$ = this.getAuthenticatedUser().pipe(
      map((user) => {
        if (user === null) throw new Error('asdsad ');

        return user.uid;
      })
    );

    const req$ = userUid$.pipe(
      switchMap((uid) =>
        this.client
          .from('user')
          .update({
            name,
          })
          .eq('uid', uid)
          .select('*')
      ),
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      })
    );

    return req$.pipe(tap((_) => this.signalUpdateUserProfile()));
  }

  uploadAvatar(photo: File, uid: string) {
    const date = Math.floor(new Date().getTime() / 1000);
    const upload$ = from(
      this.client.storage
        .from('avatars')
        .upload(`${uid}-t-${date}.png`, photo, {
          cacheControl: '3600',
          upsert: true,
        })
    ).pipe(
      map((res) => {
        if (res.error !== null) throw new Error('failed to upload photo');

        return;
      })
    );

    const avatarLastUpdate$ = from(
      this.client
        .from('user')
        .update({
          avatar_last_update: date,
        })
        .eq('uid', uid)
    ).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      })
    );

    return forkJoin([avatarLastUpdate$, upload$]).pipe(
      tap((_) => this.signalUpdateUserProfile())
    );
  }

  deleteAvatar(path: string) {
    // todo: run this on new avatar upload, or learn the cdn bust cache
    const req = this.client.storage.from('avatars').remove([path]);
    const req$ = from(req).pipe(
      map((res) => {
        if (res.error !== null) throw new Error('failed to delete image');

        return res.data;
      }),
      tap((_) => this.signalUpdateUserProfile())
    );

    return req$;
  }

  getUser(uid: string) {
    if (uid === '') return throwError(() => new Error('uid is invalid'));
    const avatar = this.client.storage
      .from('avatars')
      .getPublicUrl(uid + '.png');

    const req = this.client.from('user').select('*').eq('uid', uid).single();
    const req$ = from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      }),
      map(({ name, role_id, uid, avatar_last_update }) => ({
        name,
        role_id,
        uid,
        avatar: avatar.data.publicUrl,
        avatar_last_update,
      }))
    );

    return req$;
  }

  private createStudentInfo(uid: string, studentNumber: string) {
    const client = this.client;
    const data = {
      uid,
      number: studentNumber,
    };

    const insert = client.from('student_info').insert(data);
    const insert$ = from(insert).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      })
    );

    return insert$;
  }

  getNotifications() {
    const user$ = this.getAuthenticatedUser().pipe(filter(isNotNull));
    const req$ = this.updateNotifications$.pipe(
      switchMap((_) => user$),
      switchMap(({ uid }) => {
        const req = this.client
          .from('project_invitation')
          .select('*')
          .eq('receiver_uid', uid);

        return from(req).pipe(
          map((res) => {
            const { data } = errorFilter(res);

            return data;
          })
        );
      })
    );

    return req$;
  }

  acceptInvitation(
    id: number,
    userUid: string,
    roleId: number,
    projectId: number
  ) {
    const req = this.client.from('project_invitation').delete().eq('id', id);

    const req$ = from(req).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap(() => this.signalUpdateNotifications())
    );

    let data: Partial<ProjectRow> = {
      technical_adviser_id: userUid,
    };

    if (roleId === 1) {
      data = {
        capstone_adviser_id: userUid,
      };
    }

    const update = this.client.from('project').update(data).eq('id', projectId);
    const update$ = from(update).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      })
    );

    return req$.pipe(switchMap((_) => update$));
  }

  deleteInvitation(id: number) {
    const req = this.client.from('project_invitation').delete().eq('id', id);

    const req$ = from(req).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap(() => this.signalUpdateNotifications())
    );

    return req$;
  }

  addAvailableSchedule(
    taUid: string,
    date: string,
    start_time: number,
    end_time: number
  ) {
    const data = {
      technical_adviser: taUid,
      date,
      start_time,
      end_time,
    };
    const req = this.client.from('available_schedule').insert(data);
    const req$ = from(req).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap((_) => this.signalUpdateAvailableSchedules())
    );

    return req$;
  }

  getAvailableSchedules() {
    const technicalAdviser$ = this.getAuthenticatedUser().pipe(
      filter(isNotNull),
      map((u) => {
        if (u.role_id !== 5) return false;

        return u.uid;
      })
    );

    const req$ = this.updateAvailableSchedules$.pipe(
      switchMap((_) => technicalAdviser$),
      switchMap((uid) =>
        this.client
          .from('available_schedule')
          .select('*')
          .eq('technical_adviser', uid)
          .eq('is_available', true)
      ),
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      })
    );

    return req$;
  }

  getProjectAvailableSchedules(taUid: string) {
    const req = this.client
      .from('available_schedule')
      .select('*')
      .eq('technical_adviser', taUid)
      .eq('is_available', true);

    const req$ = this.updateAvailableSchedules$.pipe(
      switchMap((_) => from(req)),
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      })
    );

    return req$;
  }

  getScheduleData(id: number) {
    const req = this.client
      .from('available_schedule')
      .select('*')
      .eq('id', id)
      .single();

    const req$ = from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data;
      })
    );

    return req$;
  }

  markScheduleUnavailable(id: number) {
    const req = this.client
      .from('available_schedule')
      .update({ is_available: false })
      .eq('id', id);

    const req$ = from(req).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      })
    );

    return req$;
  }

  editAvailableSchedule(
    id: number,
    date: string,
    startTime: number,
    endTime: number
  ) {
    const data = {
      date,
      start_time: startTime,
      end_time: endTime,
    };

    const req = this.client
      .from('available_schedule')
      .update(data)
      .eq('id', id);
    const req$ = from(req).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap((_) => this.signalUpdateAvailableSchedules())
    );

    return req$;
  }

  deleteAvailableSchedule(id: number) {
    const req = this.client.from('available_schedule').delete().eq('id', id);
    const req$ = from(req).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      }),
      tap((_) => this.signalUpdateAvailableSchedules())
    );

    return req$;
  }

  private updateUserData(
    userId: string,
    //todo: create interface for this, name it UserRow
    user: { name: string; roleId: number }
  ) {
    if (userId === '') return throwError(() => new Error('User ID is invalid'));

    const query = this.client
      .from('user')
      .upsert({
        uid: userId,
        name: user.name,
        role_id: user.roleId,
      })
      .select('*');
    const query$ = from(query).pipe(
      map((a) => {
        if (a.error) throw a.error;

        return a.data[0];
      })
    );

    return query$;
  }

  private getCurrentUser() {
    const user = this.userSubject.getValue();

    if (user == null) return null;

    return user;
  }

  private updateCurrentUser(id: string) {
    const userDetails$ = this.getUser(id);
    userDetails$
      .pipe(
        map((user) => ({
          name: user.name,
          role_id: user.role_id,
          uid: id,
          avatar_last_update: user.avatar_last_update,
        })),
        tap((loggedInUser) => this.userSubject.next(loggedInUser))
      )
      .subscribe({
        next: () => {},
      });
  }

  private signalUpdateUserProfile() {
    const old = this.updateUserProfileSubject.getValue();
    this.updateUserProfileSubject.next(old + 1);
  }
  private signalUpdateNotifications() {
    const old = this.updateNotificationsSubject.getValue();
    this.updateNotificationsSubject.next(old + 1);
  }
  signalUpdateAvailableSchedules() {
    const old = this.updateAvailableSchedulesSubject.getValue();
    this.updateAvailableSchedulesSubject.next(old + 1);
  }
}
