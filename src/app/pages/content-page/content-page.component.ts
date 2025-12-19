import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

type ContentRouteData = { title?: string; subtitle?: string };

@Component({
  selector: 'app-content-page',
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.css']
})
export class ContentPageComponent {
  title = 'Section';
  subtitle = '';

  constructor(private readonly route: ActivatedRoute) {
    this.route.data.subscribe((data) => {
      const typed = data as ContentRouteData;
      this.title = typed.title ?? 'Section';
      this.subtitle = typed.subtitle ?? '';
    });
  }
}
