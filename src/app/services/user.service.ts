import { Injectable } from '@angular/core';
import supabaseClient from '../lib/supabase';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly client = supabaseClient;

  constructor() {}

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
}
