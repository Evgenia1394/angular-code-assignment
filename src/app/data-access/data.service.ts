import {ApiMockService} from "./api-mock.service";
import {forkJoin, map, Observable} from "rxjs";
import {CategoryMeta, Poll, PollCategory} from "./types";
import {Injectable} from "@angular/core";
//Для агрегации данных стоило сделать отдельный сервис.
// Вообще сейчас как таковой агрегации и нет, т.к.
// нет одного общего обзервабла с данными именно для карточек голосований
@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private api: ApiMockService) {}

  public categories$ = this.api.getCategories();
  public categoriesMeta$ = this.api.getCategoriesMeta();
  public polls$ = this.api.getPolls();

  //Запросы, связанные с категориями, стоило вынести в отдельный поток,
  // в котором можно было бы объединить данные и который потом можно
  // было бы использовать для фильтра
  public categoriesAllData$: Observable<AllCategoriesData> = forkJoin([
    this.categories$,
    this.categoriesMeta$
  ]).pipe(
    map(([categories, categoriesMeta]) => {
      let allCategoriesData: AllCategoriesData = {};
      categories.forEach(category => {
        const categoryMeta = categoriesMeta.find(itemMeta => category.alias === itemMeta.alias);
        if (categoryMeta) {
          allCategoriesData[category.id] = categoryMeta;
        }
      });
      return allCategoriesData;
    })
  );
  //Если иметь поток с категориями, то можно иметь и поток с
  // данными для карточек голосований.
  // Т.е. запрашиваем данные голосований -> подмешиваем в них полученные данные категорий
  public pollWithCategories$: Observable<PollWithCategoryData[]> = forkJoin([
    this.categoriesAllData$,
    this.polls$
  ]).pipe(
    map(([categoriesData, polls]) => {
      return polls.map((item: Poll) => {
        const meta = categoriesData[item.category_id];
        return {
          ...item,
          name: meta.name,
          alias: meta.alias,
          smallIcon: meta.smallIcon,
          largeIcon: meta.largeIcon,
          backgroundColor: meta.backgroundColor,
          textColor: meta.textColor,
        }
      })
    }))
}

export interface AllCategoriesData {
  [key: string]: CategoryMeta;
}

export interface PollWithCategoryData {
  id: number;
  title: string;
  points: number;
  voters_count: number;
  category_id: PollCategory['id'];
  image: string;
  //данные по категории
  name: string;
  alias: PollCategory['alias'];
  smallIcon: string;
  largeIcon: string;
  backgroundColor: string;
  textColor: string;
}
