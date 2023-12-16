import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppModule} from "./app.module";
import {PollCategory} from "./data-access/types";
import {ApiMockService} from "./data-access/api-mock.service";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {DataService, PollWithCategoryData} from "./data-access/data.service";
import {BehaviorSubject, combineLatest, map, Observable, shareReplay, startWith} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [AppModule, CommonModule, HttpClientModule, FormsModule],
  providers: [ApiMockService, DataService],
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  //В компоненте достаточно иметь два обзервабла, на которые подписывались бы через async pipe в темплейте.
  public polls$!: Observable<PollWithCategoryData[]>;
  public categories$!: Observable<PollCategory[]>;
  public isLoading: boolean = true;
  //Плюс BehaviorSubject для выбранной категории.
  public selectedCategory = new BehaviorSubject<number | null>(null);
  public selectedCategoryId: number | null = null;
  public originalPolls$!: Observable<PollWithCategoryData[]>; // Для хранения исходных данных

  constructor(public dataService: DataService) {}
  title = 'angular-code-assignment';

  ngOnInit() {
    // shareReplay для кеширования
    this.originalPolls$ = this.dataService.pollWithCategories$.pipe(shareReplay(1));

    this.categories$ = this.dataService.categories$;
    // Комбинируем исходные данные с выбранной категорией для фильтрации
    this.polls$ = combineLatest([
      this.originalPolls$,
      this.selectedCategory.asObservable()
    ]).pipe(
      map(([polls, selectedCategoryId]) => {
        this.isLoading = false;
        return selectedCategoryId === null ? polls : polls.filter(poll => poll.category_id === selectedCategoryId);
      })
    );
  }

  public filterReset() {
    this.selectedCategory.next(null);
    this.selectedCategoryId = null;
  };

  public onCategoryChange = (event: Event) => {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    if (value) {
      const numericValue = Number(value);
      this.selectedCategoryId = isNaN(numericValue) ? null : numericValue;
    } else {
      this.selectedCategoryId = null;
    }
    this.selectedCategory.next(this.selectedCategoryId);
  };
};
