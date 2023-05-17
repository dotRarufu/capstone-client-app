import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthResponse,
} from '@supabase/supabase-js';
import { BehaviorSubject, from, map, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { CapstoolUser } from '../models/capstool-user';

@Injectable({
  providedIn: 'root',
})
// todo: might have to separate auth from database service
export class SupabaseService {
  private supabase: SupabaseClient;
  private capstoolUserSubject = new BehaviorSubject<CapstoolUser | null>(null);
  capstoolUser$ = this.capstoolUserSubject.asObservable();

  constructor() {
    this.supabase = createClient(
      environment.supabase_url,
      environment.supabase_key
    );
  }

  checkTitleQuality(title: string) {
    const userId = this.capstoolUserSubject.getValue()?.id;
    const body = {
      title,
      userId,
      name: 'Functions',
    };
    const titleQualityCheck = this.supabase.functions.invoke(
      'title-quality-checker',
      {
        body,
      }
    );
    const titleQualityCheck$ = from(titleQualityCheck);

    return titleQualityCheck$;
  }

  getCurrentUser() {
    // todo: improve this so that, on reload, user is still authenticated
    return this.capstoolUserSubject.getValue();
  }

  signInUser(email: string, password: string) {
    const signIn = this.supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    const signIn$ = from(signIn).pipe(
      // update subj
      // todo: separate fetch from shaping
      switchMap((authRes) => this.getUserData(authRes)),
      map((user) => this.capstoolUserSubject.next(user))
    );

    return signIn$;
  }

  registerUser(
    email: string,
    password: string,
    userInfo: { name: string; roleId: number }
  ) {
    const signUp = this.supabase.auth.signUp({
      email: email,
      password: password,
    });
    const signUp$ = from(signUp).pipe(
      switchMap((authRes) => {
        if (authRes.error) throw authRes.error.message;
        if (authRes.data.user == null)
          // todo: on what case is user == null, even without error
          throw 'user is null, while data.error is null';

        const userId = authRes.data.user.id;
        const updateUserData$ = this.updateUserData(userId, userInfo).pipe(
          map(() => authRes)
        );

        return updateUserData$;
      })
    );

    return signUp$;
  }

  private updateUserData(
    userId: string,
    //todo: create interface for this, name it UserRow
    user: { name: string; roleId: number }
  ) {
    const query = this.supabase.from('user').upsert({
      uid: userId,
      name: user.name,
      role_id: user.roleId,
    });
    const query$ = from(query).pipe(
      map((a) => {
        if (a.error) throw a.error;
      })
    );

    return query$;
  }

  private async getUserData(authRes: AuthResponse) {
    if (authRes.data.user == null) return null;

    const user = authRes.data.user;
    const userRow = await this.supabase
      .from('user')
      .select('name, role_id')
      .eq('uid', user.id)
      .single();

    if (userRow.data == null)
      throw new Error(
        `no found row for user id ${user.id} even though user was able to log in`
      );

    const { name, role_id: roleId } = userRow.data;
    const res: CapstoolUser = { ...user, name, roleId };

    return res;
  }

  async signOutUser() {
    await this.supabase.auth.signOut();
  }
}
