import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements AfterViewInit {
  ngAfterViewInit() {
    const cards = document.querySelectorAll('.team-card')

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          const delay = el.dataset['delay'] || 0

          setTimeout(() => {
            el.classList.remove('opacity-0', 'translate-x-20')
          }, Number(delay))

          observer.unobserve(el)
        }
      })
    }, { threshold: 0.2 })

    cards.forEach(card => observer.observe(card))
  }
}
