import { Injectable } from '@angular/core';
import { from, map, switchMap } from 'rxjs';
import { User } from '../types/collection';
import errorFilter from '../utils/errorFilter';
import { ConsultationData } from '../models/consultationData';
import supabaseClient from '../lib/supabase';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  readonly client = supabaseClient;
  constructor() {}

  updateUserData(
    userId: string,
    //todo: create interface for this, name it UserRow
    user: { name: string; roleId: number }
  ) {
    const query = this.client
      .from('user')
      .upsert({
        uid: userId,
        name: user.name,
        role_id: user.roleId,
      })
      .select('*');
    const query$ = from(query).pipe(
      map((a) => {
        if (a.error) throw a.error;

        return a.data[0];
      })
    );

    return query$;
  }

  createStudentInfo(uid: string, studentNumber: string, sectionId: number) {
    const client = this.client;
    const data = {
      uid,
      number: studentNumber,
      section_id: sectionId,
    };

    const insert = client.from('student_info').insert(data);
    const insert$ = from(insert).pipe(
      map((res) => {
        const { statusText } = errorFilter(res);

        return statusText;
      })
    );

    return insert$;
  }

  insertConsultation(
    userUid: string,
    data: ConsultationData,
    projectId: number
  ) {
    const newData = {
      organizer_id: userUid,
      project_id: projectId,
      date_time: data.dateTime,
      location: data.location,
      description: data.description,
    };

    const insertConsultation = this.client
      .from('consultation')
      .insert(newData)
      .select('id');

    return from(insertConsultation).pipe(
      map((res) => {
        const { data } = errorFilter(res);

        return data[0].id;
      }),

      switchMap((id) => this.insertAccomplishedTasks(id, data.taskIds))
    );
  }

  insertAccomplishedTasks(consultationId: number, taskIds: number[]) {
    const request = Promise.all(
      taskIds.map(async (id) => {
        const data = {
          consultation_id: consultationId,
          task_id: id,
        };
        const response = await this.client
          .from('accomplished_task')
          .insert(data)
          .select('*');

        const { statusText } = errorFilter(response);

        return statusText;
      })
    );

    return from(request);
  }

  async getUserData(userId: string) {
    if (userId == null) throw new Error('user is null');

    const userUid = userId;
    const userRow = await this.client
      .from('user')
      .select('*')
      .eq('uid', userUid)
      .single();

    if (userRow.data == null)
      throw new Error(
        `no found row for user id ${userUid} even though user was able to log in`
      );
    
    const { name, role_id,avatar_last_update  } = userRow.data;

    if (!name) throw new Error('wip, name is undefined');
    if (role_id === null) throw new Error('wip, roleId is undefined');

    const res: User = { avatar_last_update,role_id, name, uid: userUid };

    return res;
  }

  async getProjectCount() {
    const response = await this.client
      .from('capstone_projects')
      .select('project_id');
    const count = response.data?.length;
    if (!count)
      throw new Error(
        'wip, seomthing wrong occured while fetching project count'
      );

    return count;
  }

  async getCategoryName(categoryId: number) {
    const response = await this.client
      .from('categories')
      .select('name')
      .eq('category_id', categoryId);

    if (response.error)
      throw new Error(`error getting category name for ${categoryId}`);

    return response.data[0].name;
  }

  async getSection(id: number) {
    const res = await this.client.from('section').select('name').eq('id', id);
    const { data } = errorFilter(res);

    return data[0].name;
  }
}
