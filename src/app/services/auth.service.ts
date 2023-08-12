import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { User } from '../types/collection';
import { UserService } from './user.service';
import supabaseClient from '../lib/supabase';
import errorFilter from '../utils/errorFilter';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private readonly client = supabaseClient;
  user$ = this.userSubject.asObservable();

  constructor(
    private databaseService: DatabaseService,
    private userService: UserService,
    private router: Router
  ) {
    this.handleSignOutEvent();
  }

  async getAuthenticatedUser() {
    const currentUser = this.getCurrentUser();

    if (currentUser !== null) return currentUser;

    const client = supabaseClient;
    const response = await client.auth.getUser();
    const user = response.data.user;

    if (user !== null) {
      this.updateCurrentUser(user.id);
      return await this.userService.getUser(user.id);
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

  private handleSignOutEvent() {
    const client = supabaseClient;
    client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        this.userSubject.next(null);
        this.router.navigate(['']);
      }
    });
  }

  private getCurrentUser() {
    const user = this.userSubject.getValue();

    if (user == null) return null;

    return user;
  }

  updateName(name: string) {
    const user$ = from(this.getAuthenticatedUser());
    return user$.pipe(
      map(user => {
        if (user === null) throw new Error("asdsad ");

        return user.uid;
      }),
      switchMap((uid) =>
        this.client
          .from('user')
          .update({
            name,
          })
          .eq('uid', uid).select("*")
      ),
      map(res => {
        const {statusText, data} = errorFilter(res);
        console.log("new", data);
        return statusText;
      })
    );
  }
}
