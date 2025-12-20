import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page.component';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { AdminPostEditorPageComponent } from './pages/admin-post-editor-page/admin-post-editor-page.component';
import { AdminPostListPageComponent } from './pages/admin-post-list-page/admin-post-list-page.component';
import { ContentPageComponent } from './pages/content-page/content-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LiveAttacksPageComponent } from './pages/live-attacks-page/live-attacks-page.component';
import { PublicPostPageComponent } from './pages/public-post-page/public-post-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminDashboardPageComponent },
      { path: 'posts', component: AdminPostListPageComponent },
      { path: 'posts/new', component: AdminPostEditorPageComponent },
      { path: 'posts/:id/edit', component: AdminPostEditorPageComponent }
    ]
  },
  {
    path: 'cheat-sheets',
    component: ContentPageComponent,
    data: { title: '0x01 — Cheat Sheets', subtitle: 'Fast recall. Minimal fluff. Maximum signal.', section: 'cheat-sheets' }
  },
  {
    path: 'tutorials',
    component: ContentPageComponent,
    data: { title: '0x02 — Technical Tutorials', subtitle: 'Step-by-step field notes for real systems.', section: 'tutorials' }
  },
  {
    path: 'toolset',
    component: ContentPageComponent,
    data: { title: '0x03 — The Toolset', subtitle: 'Curated utilities, workflows, and configs.', section: 'toolset' }
  },
  {
    path: 'manifesto',
    component: ContentPageComponent,
    data: { title: '0x04 — Manifesto', subtitle: 'Principles, threat models, and craft.', section: 'manifesto' }
  },
  {
    path: 'pfe-books',
    component: ContentPageComponent,
    data: { title: '0x05 — PFE Books', subtitle: 'PDFs, writeups, and references for project work.', section: 'pfe-books' }
  },
  { path: 'live-attacks', component: LiveAttacksPageComponent },
  { path: 'p/:slug', component: PublicPostPageComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
