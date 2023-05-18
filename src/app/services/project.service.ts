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
export class ProjectService {
  projects: {
    name: string;
    uid: string;
    description: string;
    members: string[];
  }[] = [
    {
      name: 'Capstool',
      uid: '213k-das2-fds3',
      description: 'project description example',
      members: ['Tanya Markova', 'Gardo Versoza', 'Zsa Zsa Padilla'],
    },
    {
      name: 'Capstool 2',
      uid: '213k-das2-fds3',
      description: 'project description example',
      members: ['Tanya Markova', 'Gardo Versoza', 'Zsa Zsa Padilla'],
    },
    {
      name: 'Capstool 3',
      uid: '213k-das2-fds3',
      description: 'project description example',
      members: ['Tanya Markova', 'Gardo Versoza', 'Zsa Zsa Padilla'],
    },
  ];

  activeProjectId: string = '';

  getProjects() {
    return this.projects;
  }
}
