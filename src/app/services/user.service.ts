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
import { Task, User } from '../types/collection';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly client;

  constructor(
    private supabaseService: SupabaseService,
  ) {
   this.client = this.supabaseService.client
  }

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
