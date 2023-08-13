import { Injectable, inject } from '@angular/core';
import supabaseClient from '../lib/supabase';
import { from, map, switchMap } from 'rxjs';
import errorFilter from '../utils/errorFilter';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly client = supabaseClient;

  // todo: refactor,  turn to observable
  async getUser(uid: string) {
    const res = await this.client.from('user').select('*').eq('uid', uid).single();
    const avatar = await this.client.storage
      .from('avatars')
      .getPublicUrl(uid + '.png');

    if (res.error !== null) {
      console.error('error while fetching user');

      return {
        name: 'unregistered user',
        role_id: -1,
        uid: '',
        avatar: avatar.data.publicUrl || 'error getting avatar',
        avatar_last_update: 0
      };
    }

    const {name, role_id,avatar_last_update} = res.data;

    return  {
      name,
      role_id,
      uid,
      avatar: avatar.data.publicUrl,
      avatar_last_update
    };
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
