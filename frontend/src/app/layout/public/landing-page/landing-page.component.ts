import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-landing-page',
  imports: [
    RouterLink
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
