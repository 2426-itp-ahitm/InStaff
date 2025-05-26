import { Component } from '@angular/core';
import {CalendarComponent} from '../calendar/calendar.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    CalendarComponent,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
