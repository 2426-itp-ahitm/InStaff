import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-features',
  imports: [],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})
export class FeaturesComponent implements AfterViewInit {
  ngAfterViewInit() {

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer.unobserve(entry.target)
        }
      })
    }, {
      threshold: 0.2
    })

    document
      .querySelectorAll('.observe-left, .observe-right, .observe-center')
      .forEach(el => observer.observe(el))
  }
}
