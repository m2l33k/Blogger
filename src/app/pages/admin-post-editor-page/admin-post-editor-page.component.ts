import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post, PostSection, PostService, PostStatus } from '../../services/post.service';

type FormModel = {
  title: string;
  excerpt: string;
  content: string;
  section: PostSection;
  tags: string;
  status: PostStatus;
};

@Component({
  selector: 'app-admin-post-editor-page',
  templateUrl: './admin-post-editor-page.component.html',
  styleUrls: ['./admin-post-editor-page.component.css']
})
export class AdminPostEditorPageComponent {
  mode: 'new' | 'edit' = 'new';
  postId: string | null = null;
  form: FormModel = { title: '', excerpt: '', content: '', section: 'tutorials', tags: '', status: 'draft' };
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly postService: PostService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mode = 'edit';
      this.postId = id;
      const post = this.postService.getById(id);
      if (!post) {
        this.error = 'Post not found';
      } else {
        this.form = this.fromPost(post);
      }
    }
  }

  save(): void {
    this.error = '';
    if (!this.form.title.trim()) {
      this.error = 'Title is required';
      return;
    }

    const tags = this.form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (this.mode === 'new') {
      this.postService.create({
        title: this.form.title,
        excerpt: this.form.excerpt,
        content: this.form.content,
        section: this.form.section,
        tags,
        status: this.form.status
      });
      this.router.navigateByUrl('/admin/posts');
      return;
    }

    if (!this.postId) {
      this.error = 'Missing post id';
      return;
    }

    const updated = this.postService.update(this.postId, {
      title: this.form.title,
      excerpt: this.form.excerpt,
      content: this.form.content,
      section: this.form.section,
      tags,
      status: this.form.status
    });

    if (!updated) {
      this.error = 'Post not found';
      return;
    }

    this.router.navigateByUrl('/admin/posts');
  }

  cancel(): void {
    this.router.navigateByUrl('/admin/posts');
  }

  private fromPost(post: Post): FormModel {
    return {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      section: post.section,
      tags: post.tags.join(', '),
      status: post.status
    };
  }
}
