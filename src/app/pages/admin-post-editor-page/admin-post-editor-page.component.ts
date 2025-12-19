import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post, PostFile, PostSection, PostService, PostStatus } from '../../services/post.service';

type FormModel = {
  title: string;
  excerpt: string;
  content: string;
  section: PostSection;
  tags: string;
  status: PostStatus;
  externalUrl: string;
  coverImage?: PostFile;
  pdf?: PostFile;
};

@Component({
  selector: 'app-admin-post-editor-page',
  templateUrl: './admin-post-editor-page.component.html',
  styleUrls: ['./admin-post-editor-page.component.css']
})
export class AdminPostEditorPageComponent {
  mode: 'new' | 'edit' = 'new';
  postId: string | null = null;
  form: FormModel = {
    title: '',
    excerpt: '',
    content: '',
    section: 'tutorials',
    tags: '',
    status: 'draft',
    externalUrl: ''
  };
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
        status: this.form.status,
        externalUrl: this.form.externalUrl.trim() || undefined,
        coverImage: this.form.coverImage,
        pdf: this.form.pdf
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
      status: this.form.status,
      externalUrl: this.form.externalUrl.trim() || undefined,
      coverImage: this.form.coverImage,
      pdf: this.form.pdf
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

  async onPickCoverImage(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.error = 'Cover image must be an image file';
      return;
    }
    this.error = '';
    this.form.coverImage = await this.readFileAsDataUrl(file);
    input.value = '';
  }

  async onPickPdf(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    if (file.type !== 'application/pdf') {
      this.error = 'Attachment must be a PDF';
      return;
    }
    this.error = '';
    this.form.pdf = await this.readFileAsDataUrl(file);
    input.value = '';
  }

  clearCoverImage(): void {
    this.form.coverImage = undefined;
  }

  clearPdf(): void {
    this.form.pdf = undefined;
  }

  private fromPost(post: Post): FormModel {
    return {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      section: post.section,
      tags: post.tags.join(', '),
      status: post.status,
      externalUrl: post.externalUrl ?? '',
      coverImage: post.coverImage,
      pdf: post.pdf
    };
  }

  private readFileAsDataUrl(file: File): Promise<PostFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== 'string') {
          reject(new Error('Unexpected file reader result'));
          return;
        }
        resolve({ name: file.name, mime: file.type, size: file.size, dataUrl: result });
      };
      reader.readAsDataURL(file);
    });
  }
}
