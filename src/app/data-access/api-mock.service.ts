import { Injectable } from '@angular/core';
import {Observable, delay, of, retry, catchError} from 'rxjs';
import { pollsList } from './polls-mock.data';
import { pollCategories } from './categories-mock.data';
import {CategoryMeta, Poll, PollCategory} from './types';
import { HttpClient } from '@angular/common/http';

const randomDelay = (maxMs: number) => Math.random() * maxMs;

@Injectable({
  providedIn: 'root',
})
export class ApiMockService {
  constructor(private http: HttpClient) {}

//Ретрай лучше применять отдельно на каждый обсервабл с запросом
  getPolls(): Observable<Poll[]> {
    return of(pollsList).pipe(
      delay(randomDelay(5000)),
      retry(3),
      catchError(error => {
        console.error('Ошибка при получении опросов:', error);
        return of([]);
      })
    );
  }

  getCategories(): Observable<PollCategory[]> {
    return of(pollCategories).pipe(
      delay(randomDelay(5000)),
      retry(3),
      catchError(error => {
        console.error('Ошибка при получении категорий:', error);
        return of([]);
      })
    );
  }

  getCategoriesMeta(): Observable<CategoryMeta[]> {
    return this.http.get<CategoryMeta[]>(
      'https://minio.ag.mos.ru/ag-main/data/poll-categories.json'
    ).pipe(
      retry(3),
      catchError(error => {
        console.error('Ошибка при получении метаданных категорий:', error);
        return of([]);
      })
    );
  }
}
