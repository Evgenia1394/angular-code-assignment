import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppModule} from "./app.module";
import {CategoryMeta, Poll, PollCategory} from "./data-access/types";
import {ApiMockService} from "./data-access/api-mock.service";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [AppModule, CommonModule, HttpClientModule, FormsModule ],
  providers: [ApiMockService],
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public AllPolls: Poll[] = [];
  public AllCategoriesData: {[id: string]: CategoryMeta} = {};
  public AllCategoriesSelect: {name: string, category_id: number}[] = [];
  public FilteredPolls: Poll[] = [];
  public isLoading: boolean = true;

  constructor(public apiMockService: ApiMockService) {}
  title = 'angular-code-assignment';
  selectedCategory: number | null = null;

  public ngOnInit() {
    (this.apiMockService.getAllData())
      .subscribe(data => {
        this.AllPolls = data.polls;
        this.FilteredPolls = data.polls;

        data.categories.forEach((category: PollCategory) => {
            this.AllCategoriesData[category.id] = data.categoriesMeta
              .find((itemMeta: CategoryMeta) => category.alias === itemMeta.alias)
            this.AllCategoriesSelect.push({name: category.name, category_id: category.id});
        })
        this.isLoading = false;
      });
  }

  public filterData() {
    this.isLoading = true;
    if (this.selectedCategory) {
      this.FilteredPolls = this.AllPolls.filter(poll => poll.category_id === Number(this.selectedCategory));
      this.isLoading = false;
    } else {
      this.FilteredPolls = this.AllPolls;
      this.isLoading = false;
    }
  }
  public filterReset() {
    return this.FilteredPolls = this.AllPolls;
  }

  public onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.filterData();
  }

  public categoryInfo(poll: Poll): CategoryMeta {
    return this.AllCategoriesData[poll.category_id]
  }
}
