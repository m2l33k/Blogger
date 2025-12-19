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
  pagePosts: Post[] = [];
  page = 1;
  pageSize = 10;
  totalPages = 1;
  pages: number[] = [];

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
      this.setPage(1);
    });
  }

  setPage(next: number): void {
    const safeTotal = Math.max(1, Math.ceil(this.posts.length / this.pageSize));
    const safePage = Math.min(Math.max(1, next), safeTotal);

    this.page = safePage;
    this.totalPages = safeTotal;
    this.pages = Array.from({ length: safeTotal }, (_, i) => i + 1);

    const start = (safePage - 1) * this.pageSize;
    this.pagePosts = this.posts.slice(start, start + this.pageSize);
  }
}
