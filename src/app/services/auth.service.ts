import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, from, map, merge, of, switchMap, tap } from 'rxjs';
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
  private readonly updateUserProfileSubject = new BehaviorSubject(0);
  updateUserProfile$ = this.updateUserProfileSubject.asObservable();

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

  getUserProfile(uid: string) {
    const user$ = this.updateUserProfile$.pipe(switchMap(__ => this.userService.getUser(uid)));
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
      avatar_last_update: userDetails.avatar_last_update
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
      switchMap(date => {
      
        const upload$ = from(this.client.storage
          .from('avatars')
          .upload(`${uid}-t-${date}.png`, photo, {
            cacheControl: '3600',
            upsert: true,
          })).pipe( map((res) => {
            if (res.error !== null) throw new Error('failed to upload photo');
    
            return ;
          }));
        
          const avatarLastUpdate$ = from(this.client.from("user").update({
            avatar_last_update: date
          }).eq("uid", uid)).pipe(
            map(res => {
              const {statusText} = errorFilter(res);
      
              return statusText;
            })
          )

        return forkJoin([avatarLastUpdate$, upload$]).pipe(

          tap((_) => {console.log("new date from uploadAvatar:",date);this.signalUpdateUserProfile();})
        );
      })
    
      
    );

   

    return req$;
  }

  private signalUpdateUserProfile() {
    const old = this.updateUserProfileSubject.getValue();
    this.updateUserProfileSubject.next(old + 1);
  }
}
