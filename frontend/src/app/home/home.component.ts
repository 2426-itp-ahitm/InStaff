import { Component } from '@angular/core';
import {CalendarComponent} from '../calendar/calendar.component';
import {CardComponent} from "../card/card.component";

@Component({
  selector: 'app-home',
    imports: [
        CalendarComponent,
        CardComponent
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
