import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, from, map, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { DatabaseService } from './database.service';
import { User } from '../types/collection';
import { UserService } from './user.service';
import { isNotNull } from '../student/utils/isNotNull';
import { getRolePath } from '../utils/getRolePath';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private supabaseService: SupabaseService,
    private databaseService: DatabaseService,
    private userService: UserService,
    private router: Router
  ) {
    const client = this.supabaseService.client;
    const unsubscribe = client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        this.userSubject.next(null);
        this.router.navigate(['']);
      }
    });

    // this causes problem when user navigates to a path by window url
    // this.user$
    //   .pipe(
    //     filter(isNotNull),
    //   )
    //   .subscribe({
    //     next: (user) => {
    //       const role = getRolePath(user.role_id);
    //       // this.router.navigate([role]);
    //     },
    //   });
  }

  async getAuthenticatedUser() {
    const client = this.supabaseService.client;
    const res = await client.auth.getUser();
    const user = res.data.user;

    // console.log("get authenticated user:", user);

    if (user !== null) this.updateCurrentUser(user.id);

    return user;
  }

  getCurrentUser() {
    const user = this.userSubject.getValue();

    if (user == null) {
      // console.log('no user is signed in');
      return null;
    }

    return user;
  }

  async updateCurrentUser(id: string) {
    const userDetails = await this.userService.getUser(id);

    const loggedInUser: User = {
      name: userDetails.name,
      role_id: userDetails.role_id,
      uid: id,
    };

    this.userSubject.next(loggedInUser);
  }

  login(email: string, password: string) {
    const client = this.supabaseService.client.auth;
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
    email: string,
    password: string,
    userInfo: { name: string; roleId: number },
    studentNumber: string,
    sectionId: number
  ) {
    const client = this.supabaseService.client;
    const signUp = client.auth.signUp({
      email,
      password,
    });
    const signUp$ = from(signUp).pipe(
      map((authRes) => {
        // todo separate this block in another pipe
        if (authRes.error) throw authRes.error.message;
        if (authRes.data.user == null)
          // todo: on what case is user == null, even without error
          throw 'user is null, while data.error is null';

        return authRes.data.user;
      }),
      switchMap((user) =>
        this.databaseService.updateUserData(user.id, userInfo)
      ),
      switchMap((user) =>
        this.createStudentInfo(user.uid, studentNumber, sectionId)
      )
    );

    return signUp$;
  }

  createStudentInfo(uid: string, studentNumber: string, sectionId: number) {
    const client = this.databaseService.client;
    const data = {
      uid,
      number: studentNumber,
      section_id: sectionId,
    };
    const insert = client.from('student_info').insert(data);
    const insert$ = from(insert).pipe(
      map((res) => {
        if (res.error !== null)
          throw new Error('error in creating student info');

        return res.statusText;
      })
    );

    return insert$;
  }

  signOut() {
    const signOut = this.supabaseService.client.auth.signOut();
    const signOut$ = from(signOut);
    // this._user$.next

    return signOut$;
  }
}
