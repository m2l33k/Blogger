import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentPageComponent } from './pages/content-page/content-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'cheat-sheets',
    component: ContentPageComponent,
    data: { title: '0x01 — Cheat Sheets', subtitle: 'Fast recall. Minimal fluff. Maximum signal.' }
  },
  {
    path: 'tutorials',
    component: ContentPageComponent,
    data: { title: '0x02 — Technical Tutorials', subtitle: 'Step-by-step field notes for real systems.' }
  },
  {
    path: 'toolset',
    component: ContentPageComponent,
    data: { title: '0x03 — The Toolset', subtitle: 'Curated utilities, workflows, and configs.' }
  },
  {
    path: 'manifesto',
    component: ContentPageComponent,
    data: { title: '0x04 — Manifesto', subtitle: 'Principles, threat models, and craft.' }
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
