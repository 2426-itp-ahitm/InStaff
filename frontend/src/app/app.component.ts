import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import tailwindcss from '@tailwindcss/vite'
import {MenuComponent} from './menu/menu.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})
export class AppComponent {
  title = 'frontend';
}
