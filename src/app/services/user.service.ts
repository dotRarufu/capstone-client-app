import { Injectable } from '@angular/core';
import supabaseClient from '../lib/supabase';
import { from, map } from 'rxjs';
import errorFilter from '../utils/errorFilter';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly client = supabaseClient;

  constructor() {}

  // todo: refactor,  turn to observable
  async getUser(uid: string) {
    const res = await this.client.from('user').select('*').eq('uid', uid);

    if (res.error !== null) {
      console.error('error while fetching user');

      return {
        name: 'unregistered user',
        role_id: -1,
        uid: '',
      };
    }

    return res.data[0];
  }
  getUserA(uid: string) {
    const req = this.client.from('user').select('*').eq('uid', uid);
    const req$ = from(req).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data[0];
      })
    );

    return req$;
  }
}
