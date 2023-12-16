import {Component, Input} from '@angular/core';
import {PollWithCategoryData} from "../data-access/data.service";

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() item!: PollWithCategoryData;
}
