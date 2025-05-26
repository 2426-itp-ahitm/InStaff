import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-card',
    imports: [
        RouterLink
    ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() headline!: String;
  @Input() details!: String;
  @Input() route!: String;
  @Input() icon!: String;

}
