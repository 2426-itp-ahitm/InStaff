import {Component} from '@angular/core';
import {Location} from '@angular/common'

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  constructor(private location: Location) {
  }

  goBack() {
    this.location.back()
  }
}
