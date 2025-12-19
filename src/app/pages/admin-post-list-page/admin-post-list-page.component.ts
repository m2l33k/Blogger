import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Post, PostService } from '../../services/post.service';

@Component({
  selector: 'app-admin-post-list-page',
  templateUrl: './admin-post-list-page.component.html',
  styleUrls: ['./admin-post-list-page.component.css']
})
export class AdminPostListPageComponent {
  posts: Post[] = [];

  constructor(
    private readonly postService: PostService,
    private readonly router: Router
  ) {
    this.refresh();
  }

  refresh(): void {
    this.posts = this.postService.list();
  }

  newPost(): void {
    this.router.navigateByUrl('/admin/posts/new');
  }

  edit(post: Post): void {
    this.router.navigateByUrl(`/admin/posts/${post.id}/edit`);
  }

  remove(post: Post): void {
    this.postService.delete(post.id);
    this.refresh();
  }
}

