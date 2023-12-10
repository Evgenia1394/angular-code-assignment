import {Component, Input} from '@angular/core';
import {CategoryMeta, Poll} from "../data-access/types";

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() item!: Poll;
  @Input() CategoryInfo!: CategoryMeta;
}
