import {Component} from '@angular/core';
import {MenuComponent} from '../../essentials/menu/menu.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-private-layout',
  imports: [
    MenuComponent,
    RouterOutlet
  ],
  templateUrl: './private-layout.component.html',
  styleUrl: './private-layout.component.css'
})
export class PrivateLayoutComponent {

}
