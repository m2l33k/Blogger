import { Injectable } from '@angular/core';

export type PostStatus = 'draft' | 'published';
export type PostSection = 'cheat-sheets' | 'tutorials' | 'toolset' | 'manifesto' | 'pfe-books';

export type PostFile = {
  name: string;
  mime: string;
  size: number;
  dataUrl: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  section: PostSection;
  status: PostStatus;
  externalUrl?: string;
  coverImage?: PostFile;
  pdf?: PostFile;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = 'np_posts_v1';

@Injectable({ providedIn: 'root' })
export class PostService {
  list(): Post[] {
    return this.readAll().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }

  getById(id: string): Post | null {
    return this.readAll().find((p) => p.id === id) ?? null;
  }

  getBySlug(slug: string): Post | null {
    const normalized = this.normalizeSlug(slug);
    return this.readAll().find((p) => p.slug === normalized) ?? null;
  }

  listPublishedBySection(section: PostSection): Post[] {
    return this.list().filter((p) => p.status === 'published' && p.section === section);
  }

  create(input: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'slug'> & { slug?: string }): Post {
    const now = new Date().toISOString();
    const post: Post = {
      id: this.newId(),
      title: input.title.trim(),
      slug: this.normalizeSlug(input.slug ?? this.slugify(input.title)),
      excerpt: input.excerpt ?? '',
      content: input.content ?? '',
      tags: input.tags ?? [],
      section: input.section,
      status: input.status,
      externalUrl: input.externalUrl,
      coverImage: input.coverImage,
      pdf: input.pdf,
      createdAt: now,
      updatedAt: now
    };

    const all = this.readAll();
    all.unshift(post);
    this.writeAll(all);
    return post;
  }

  update(id: string, patch: Partial<Omit<Post, 'id' | 'createdAt'>>): Post | null {
    const all = this.readAll();
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) {
      return null;
    }

    const current = all[index];
    const title = patch.title !== undefined ? patch.title.trim() : current.title;
    const slug =
      patch.slug !== undefined
        ? this.normalizeSlug(patch.slug)
        : patch.title !== undefined
          ? this.normalizeSlug(this.slugify(title))
          : current.slug;

    const updated: Post = {
      ...current,
      ...patch,
      title,
      slug,
      updatedAt: new Date().toISOString()
    };

    all[index] = updated;
    this.writeAll(all);
    return updated;
  }

  delete(id: string): boolean {
    const all = this.readAll();
    const next = all.filter((p) => p.id !== id);
    if (next.length === all.length) {
      return false;
    }
    this.writeAll(next);
    return true;
  }

  private readAll(): Post[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        return [];
      }
      return (parsed as any[]).flatMap((p) => {
        const next = this.coercePost(p);
        return next ? [next] : [];
      });
    } catch {
      return [];
    }
  }

  private writeAll(posts: Post[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  private newId(): string {
    const cryptoAny = (globalThis as any).crypto as Crypto | undefined;
    if (cryptoAny && 'randomUUID' in cryptoAny) {
      return (cryptoAny as any).randomUUID();
    }
    return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
  }

  private normalizeSlug(slug: string): string {
    const normalized = slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return normalized || 'untitled';
  }

  private slugify(title: string): string {
    return this.normalizeSlug(title);
  }

  private coercePost(input: any): Post | null {
    if (!input || typeof input !== 'object') {
      return null;
    }
    if (typeof input.id !== 'string' || typeof input.title !== 'string' || typeof input.slug !== 'string') {
      return null;
    }

    const tags = Array.isArray(input.tags) ? input.tags.filter((t: any) => typeof t === 'string') : [];
    const status: PostStatus = input.status === 'published' ? 'published' : 'draft';
    const section = this.isSection(input.section)
      ? input.section
      : this.inferSectionFromTags(tags) ?? ('tutorials' as const);

    const externalUrl = this.coerceExternalUrl(input.externalUrl);
    const coverImage = this.coerceFile(input.coverImage, ['image/']);
    const pdf = this.coerceFile(input.pdf, ['application/pdf']);

    return {
      id: input.id,
      title: input.title,
      slug: this.normalizeSlug(input.slug),
      excerpt: typeof input.excerpt === 'string' ? input.excerpt : '',
      content: typeof input.content === 'string' ? input.content : '',
      tags,
      section,
      status,
      externalUrl,
      coverImage,
      pdf,
      createdAt: typeof input.createdAt === 'string' ? input.createdAt : new Date().toISOString(),
      updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : new Date().toISOString()
    };
  }

  private isSection(value: any): value is PostSection {
    return (
      value === 'cheat-sheets' ||
      value === 'tutorials' ||
      value === 'toolset' ||
      value === 'manifesto' ||
      value === 'pfe-books'
    );
  }

  private inferSectionFromTags(tags: string[]): PostSection | null {
    const lowered = tags.map((t) => t.toLowerCase());
    if (lowered.includes('cheat-sheets') || lowered.includes('cheatsheets') || lowered.includes('0x01')) {
      return 'cheat-sheets';
    }
    if (lowered.includes('tutorials') || lowered.includes('0x02')) {
      return 'tutorials';
    }
    if (lowered.includes('toolset') || lowered.includes('tools') || lowered.includes('0x03')) {
      return 'toolset';
    }
    if (lowered.includes('manifesto') || lowered.includes('0x04')) {
      return 'manifesto';
    }
    if (lowered.includes('pfe-books') || lowered.includes('books') || lowered.includes('pfe') || lowered.includes('0x05')) {
      return 'pfe-books';
    }
    return null;
  }

  private coerceExternalUrl(value: any): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    return trimmed;
  }

  private coerceFile(value: any, allowedMimePrefixes: string[]): PostFile | undefined {
    if (!value || typeof value !== 'object') {
      return undefined;
    }
    const name = typeof value.name === 'string' ? value.name : '';
    const mime = typeof value.mime === 'string' ? value.mime : '';
    const size = typeof value.size === 'number' ? value.size : 0;
    const dataUrl = typeof value.dataUrl === 'string' ? value.dataUrl : '';

    if (!name || !mime || !dataUrl) {
      return undefined;
    }
    const allowed = allowedMimePrefixes.some((p) => mime.startsWith(p));
    if (!allowed) {
      return undefined;
    }
    return { name, mime, size, dataUrl };
  }
}
