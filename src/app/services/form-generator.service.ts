import { Injectable } from '@angular/core';
import supabaseClient from '../lib/supabase';
import { BehaviorSubject, filter, from, map, of, tap, throwError } from 'rxjs';
import { TitleAnalyzerResult } from '../models/titleAnalyzerResult';

type AnalyzerResultError = string;

@Injectable({
  providedIn: 'root',
})
export class FormGeneratorService {
  private readonly client = supabaseClient;
  private formUrlSubject: BehaviorSubject<string> = new BehaviorSubject('');
  // move this in user service
  private _analyzerResult$ = new BehaviorSubject<
    TitleAnalyzerResult | AnalyzerResultError | undefined | null
  >(undefined);
  formUrl$ = this.formUrlSubject.asObservable();
  analyzerResult$ = this._analyzerResult$.asObservable().pipe(
    filter((v) => v !== undefined),
    map(this.checkError)
  );

  clearAnalyzerResult() {
    this._analyzerResult$.next(undefined);
  }

  generateForm(
    projectId: number,
    formNumber: number,
    dateTime?: number,
    dateTimeRange?: number[]
  ) {
    if (formNumber < 0) return throwError(() => new Error('User uid is empty'));

    if (projectId < 0)
      return throwError(() => new Error('Project id is invalid'));

    const req = this.client.functions.invoke<string>('form-generator', {
      body: {
        formNumber,
        projectId,
        dateTime: 123,
        // todo: update the edge fn to accept dateTimeRange
        // why accept dateTimeRange? why not just output the form 4 without asking for range
        // dateTimeRange,
        name: 'Functions',
      },
    });

    const req$ = from(req).pipe(
      map((res) => {
        if (res.error !== null || res.data === null) throw new Error('error');

        return res.data;
      })
    );

    return req$;
  }

  // maybe rename this to backendService
  async analyzeTitle(title: string) {
    const userId = '47033d78-0a18-4a0e-a5a5-1f9d51d04550'; // todo: get from logged in user
    const client = this.client;
    // todo: add types for edge fn
    const response = await client.functions.invoke('title-quality-checker', {
      body: {
        title,
        userId,
        name: 'Functions',
      },
    });
    const data = response.data as TitleAnalyzerResult | null;
    this._analyzerResult$.next(data);

    return data;
  }

  private checkError(
    a: TitleAnalyzerResult | undefined | null | AnalyzerResultError
  ) {
    if (a === undefined || a === null) {
      console.log('should show error toast');
      throw new Error('undefined result');
    }

    if (typeof a === 'string') throw new Error(a);

    return a;
  }
}
