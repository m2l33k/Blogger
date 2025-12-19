import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post, PostService } from '../../services/post.service';

@Component({
  selector: 'app-public-post-page',
  templateUrl: './public-post-page.component.html',
  styleUrls: ['./public-post-page.component.css']
})
export class PublicPostPageComponent {
  post: Post | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postService: PostService
  ) {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.post = null;
      return;
    }

    const found = this.postService.getBySlug(slug);
    this.post = found && found.status === 'published' ? found : null;
  }
}

