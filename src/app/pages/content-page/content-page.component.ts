import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post, PostSection, PostService } from '../../services/post.service';

type ContentRouteData = { title?: string; subtitle?: string; section?: PostSection };

@Component({
  selector: 'app-content-page',
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.css']
})
export class ContentPageComponent {
  title = 'Section';
  subtitle = '';
  section: PostSection = 'tutorials';
  posts: Post[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postService: PostService
  ) {
    this.route.data.subscribe((data) => {
      const typed = data as ContentRouteData;
      this.title = typed.title ?? 'Section';
      this.subtitle = typed.subtitle ?? '';
      this.section = typed.section ?? 'tutorials';
      this.posts = this.postService.listPublishedBySection(this.section);
    });
  }
}
