import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  from,
  map,
  filter,
  merge,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { User } from '../types/collection';
import { UserService } from './user.service';
import supabaseClient from '../lib/supabase';
import errorFilter from '../utils/errorFilter';
import { getRolePath } from '../utils/getRolePath';
import { isNotNull } from '../utils/isNotNull';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private readonly client = supabaseClient;
  private readonly updateUserProfileSubject = new BehaviorSubject(0);
  user$ = this.userSubject.asObservable();
  updateUserProfile$ = this.updateUserProfileSubject.asObservable();
  // todo: should these use readonly?
  private databaseService = inject(DatabaseService);
  private userService = inject(UserService);
  private router = inject(Router);
  private spinner = inject(NgxSpinnerService);
  private toastr = inject(ToastrService);

  authStateChange = this.client.auth.onAuthStateChange((event, session) => {
    console.log('EVENT:', event);

    // todo: turn to switch
    if (event === 'INITIAL_SESSION') {
      console.log('User initial');
      const user$ = this.getAuthenticatedUser();
      user$.pipe(filter(isNotNull)).subscribe({
        next: (user) => {
          const role = getRolePath(user.role_id);

          if (role === 's') {
            this.router.navigate(['s']);

            return;
          }

          this.router.navigate(['a', role]);
          this.toastr.success('Welcome back ' + user.name);
        },
      });
    }

    if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      this.userSubject.next(null);
      this.router.navigate(['']);
      this.spinner.hide();
    }

    if (event === 'SIGNED_IN') {
      console.log('User signed in');

      const user$ = this.getAuthenticatedUser();
      user$
        .pipe(
          filter(isNotNull),
          map((user) => getRolePath(user.role_id))
        )
        .subscribe({
          next: (rolePath) => {
            if (rolePath !== 's') {
              this.router.navigate(['a', rolePath, 'home']);

              return;
            }

            this.router.navigate([rolePath, 'home']);

            this.spinner.hide();
          },
        });
    }
  });

  getAuthenticatedUser() {
    const currentUser = this.getCurrentUser();

    if (currentUser !== null) return of(currentUser);

    const authenticatedUser$ = from(this.client.auth.getUser()).pipe(
      map((response) => response.data.user),
      switchMap((user) => {
        // todo: use iif operator
        if (user !== null) {
          this.updateCurrentUser(user.id);

          const user$ = from(
            this.client.from('user').select('*').eq('uid', user.id).single()
          ).pipe(
            map((res) => {
              const { data } = errorFilter(res);

              return data;
            })
          );

          return user$;
        }

        return of(user);
      })
    );

    return authenticatedUser$;
  }

  getUserProfile(uid: string) {
    const user$ = this.updateUserProfile$.pipe(
      switchMap((__) => this.userService.getUser(uid))
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

  async updateCurrentUser(id: string) {
    const userDetails = await this.userService.getUser(id);
    const loggedInUser: User = {
      name: userDetails.name,
      role_id: userDetails.role_id,
      uid: id,
      avatar_last_update: userDetails.avatar_last_update,
    };

    this.userSubject.next(loggedInUser);
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

        return this.databaseService.getUserData(authRes.data.user.id);
      }),
      tap((user) => this.userSubject.next(user))
    );

    return login$;
  }

  signUp(
    // todo: handle this with forms
    email: string,
    password: string,
    userInfo: { name: string; roleId: number },
    studentNumber: string,
    sectionId: number
  ) {
    const client = supabaseClient;
    const signUp = client.auth.signUp({
      email,
      password,
    });
    const signUp$ = from(signUp).pipe(
      map((authRes) => {
        if (authRes.error) throw authRes.error.message;
        if (authRes.data.user == null)
          // on what case is user == null, even without error
          throw new Error('user is null, while data.error is null');

        return authRes.data.user;
      }),
      switchMap((user) =>
        this.databaseService.updateUserData(user.id, userInfo)
      ),
      switchMap((user) =>
        this.databaseService.createStudentInfo(
          user.uid,
          studentNumber,
          sectionId
        )
      )
    );

    return signUp$;
  }

  signOut() {
    const signOut = supabaseClient.auth.signOut();
    const signOut$ = from(signOut);

    return signOut$;
  }

  private getCurrentUser() {
    const user = this.userSubject.getValue();

    if (user == null) return null;

    return user;
  }

  updateName(name: string) {
    const user$ = this.getAuthenticatedUser();
    return user$.pipe(
      map((user) => {
        if (user === null) throw new Error('asdsad ');

        return user.uid;
      }),
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
        const { statusText, data } = errorFilter(res);
        console.log('new', data);
        return statusText;
      }),
      tap((_) => this.signalUpdateUserProfile())
    );
  }

  uploadAvatar(photo: File, uid: string) {
    const req$ = of(Math.floor(new Date().getTime() / 1000)).pipe(
      switchMap((date) => {
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
      })
    );

    return req$;
  }

  deleteAvatar(path: string) {
    // todo: run this on new avatar upload, or learn the cdn bust cache
    const req = this.client.storage.from('avatars').remove([path]);
    const req$ = from(req).pipe(
      map((res) => {
        if (res.error !== null) throw new Error('failed to delete image');
        console.log('path', path);
        return res.data;
      }),
      tap((_) => this.signalUpdateUserProfile())
    );

    return req$;
  }

  private signalUpdateUserProfile() {
    const old = this.updateUserProfileSubject.getValue();
    this.updateUserProfileSubject.next(old + 1);
  }
}
