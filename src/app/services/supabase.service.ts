import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthResponse,
} from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { CapstoolUser } from '../models/capstool-user';
import { Database } from '../types/supabase';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  
  readonly client: SupabaseClient<Database>;
  private capstoolUserSubject = new BehaviorSubject<CapstoolUser | null>(null);
  capstoolUser$ = this.capstoolUserSubject.asObservable();

  constructor() {
    this.client = createClient<Database>(
      environment.supabase_url,
      environment.supabase_key
    );
  }

  
}
