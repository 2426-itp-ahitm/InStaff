import { Component } from '@angular/core';
import {CalendarComponent} from '../calendar/calendar.component';
import {RouterLink} from '@angular/router';
import {CardComponent} from "../card/card.component";

@Component({
  selector: 'app-home',
    imports: [
        CalendarComponent,
        RouterLink,
        CardComponent
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
