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
if (res.error.code === "PGRST116") throw new Error("User does not exist");
     throw new Error("Error occured while fetching user")
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
