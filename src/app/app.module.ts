import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CardComponent} from "./card/card.component";


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [CardComponent],
	providers: [],
  exports: [CardComponent],
	bootstrap: [CardComponent],
})
export class AppModule {}
