import { Injectable } from '@angular/core';
import {Observable, delay, of, mergeMap, forkJoin,retry, catchError, throwError} from 'rxjs';
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

  getAllData(): Observable<any> {
    return this.getCategories().pipe(
      mergeMap(categories => {
        const categoriesMeta$ = this.getCategoriesMeta();
        const polls$ = this.getPolls();
        return forkJoin([categoriesMeta$, polls$]).pipe(
          mergeMap(data => {
            const combinedData = {
              categories,
              categoriesMeta: data[0],
              polls: data[1]
            };
            return of(combinedData);
          }),
          retry(3),
          catchError(error => {
            alert('Не удалось загрузить данные')
            return throwError(error);
          })
        );
      })
    );
  }

  getPolls(): Observable<Poll[]> {
    return of(pollsList).pipe(delay(randomDelay(5000)));
  }

  getCategories(): Observable<PollCategory[]> {
    return of(pollCategories).pipe(delay(randomDelay(5000)));
  }

  getCategoriesMeta(): Observable<CategoryMeta[]> {
    return this.http.get<CategoryMeta[]>(
      'https://minio.ag.mos.ru/ag-main/data/poll-categories.json'
    );
  }
}
