import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthResponse,
} from '@supabase/supabase-js';
import { BehaviorSubject, from, map, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { CapstoolUser } from '../models/capstool-user';
import { Database } from '../types/supabase';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { DatabaseService } from './database.service';
import { User } from '../types/collection';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // todo: update types of rows in db
  private _user$ = new BehaviorSubject<User | null>(null);
  user$ = this._user$.asObservable();

  constructor(
    private supabaseService: SupabaseService,
    private databaseService: DatabaseService,
    private router: Router
  ) {
    const client = this.supabaseService.client;
    const unsubscribe = client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        this._user$.next(null);
        this.router.navigate(['']);
      }
    });
  }

  getCurrentUser() {
    // todo: improve this so that, on reload, user is still authenticated
    const user = this._user$.getValue();

    // if (user == null) {throw new Error("no user is signed in");
    if (user == null) {
      console.log('no user is signed in');
      return null;
    }

    return user;
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
      tap((user) => this._user$.next(user))
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
    // todo: add record in student_info table
    const signUp$ = from(signUp).pipe(
      map((authRes) => {
        // todo separate this block in another pipe
        if (authRes.error) throw authRes.error.message;
        if (authRes.data.user == null)
          // todo: on what case is user == null, even without error
          throw 'user is null, while data.error is null';

        return authRes.data.user
      }),
      switchMap(user => this.databaseService.updateUserData(user.id, userInfo)),
      switchMap(user => this.createStudentInfo(user.uid, studentNumber, sectionId))
    );

    return signUp$;
  }

  // todo: move in user service
  createStudentInfo(uid: string, studentNumber: string, sectionId: number ) {
    const client = this.databaseService.client;
    const data = {
      uid,
      number: studentNumber,
      section_id: sectionId
    } 
    const insert = client.from("student_info").insert(data);
    const insert$ = from(insert).pipe(map(res => {
      if (res.error !== null) throw new Error("error in creating student info");

      return res.statusText;
    }))

    return insert$;
  }

  signOut() {
    const signOut = this.supabaseService.client.auth.signOut();
    const signOut$ = from(signOut);
    // this._user$.next

    return signOut$;
  }
}
