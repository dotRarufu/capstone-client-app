import { Injectable } from '@angular/core';
import {
  AuthResponse, AuthUser,
} from '@supabase/supabase-js';
import { BehaviorSubject, from, map, switchMap, tap } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { User } from '../types/collection';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  readonly client;
  constructor(private supabaseService: SupabaseService) {
    this.client = this.supabaseService.client
  }

  updateUserData(
    userId: string,
    //todo: create interface for this, name it UserRow
    user: { name: string; roleId: number }
  ) {
    const client = this.supabaseService.client;
    const query = client.from('user').upsert({
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
  
  async getUserData(userId: string) {
    if (userId == null) throw new Error('user is null');

    const userUid = userId;
    const userRow = await this.supabaseService.client
      .from('user')
      .select('name, role_id')
      .eq('uid', userUid)
      .single();

    if (userRow.data == null)
      throw new Error(
        `no found row for user id ${userUid} even though user was able to log in`
      );
    console.log('user data:', userRow.data)
    const { name, role_id } = userRow.data;

    if (!name) throw new Error('wip, name is undefined');
    if (role_id === null) throw new Error('wip, roleId is undefined');

    const res: User = { role_id, name, uid: userUid };

    return res;
  }

      // todo: do this in backend instead
      // todo: move in projectService, just like in task.service
  async getProjectsFromCategory(categoryId: number) {
    const projectIds = (
      await this.supabaseService.client
        .from('category_projects')
        .select('project_id')
        .eq('category_id', categoryId)
    ).data;

    const getTitles = async (id: number) =>
      (
        await this.supabaseService.client
          .from('capstone_projects')
          .select('title')
          .eq('project_id', id)
      ).data;

    if (!projectIds)
      throw new Error(`wip, no project found with category ${categoryId}`);

    const titles = (
      await Promise.all(
        projectIds.map(async ({ project_id }) => await getTitles(project_id))
      )
    )
      .filter(isNotNull)
      .flat()
      .map((a) => a.title);

    return titles;
  }

  async getProjectCount() {
    const response = await this.supabaseService.client.from('capstone_projects').select('project_id', );
    const count = response.data?.length;
    if (!count)
      throw new Error(
        'wip, seomthing wrong occured while fetching project count'
      );

    return count;
  }

  async getCategoryName(categoryId: number) {
    const response = await this.client.from('categories').select('name').eq('category_id', categoryId);

    if (response.error) throw new Error(`error getting category name for ${categoryId}`)

    return response.data[0].name;
  }

}

// todo move in utils
const isDefined = <T>(value: T | undefined): value is T => {
  return value !== undefined;
};
const isNotNull = <T>(value: T | null): value is T => {
  return value !== null;
};
