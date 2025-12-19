import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page.component';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { AdminPostEditorPageComponent } from './pages/admin-post-editor-page/admin-post-editor-page.component';
import { AdminPostListPageComponent } from './pages/admin-post-list-page/admin-post-list-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ContentPageComponent } from './pages/content-page/content-page.component';
import { PublicPostPageComponent } from './pages/public-post-page/public-post-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AdminDashboardPageComponent,
    AdminPostListPageComponent,
    AdminPostEditorPageComponent,
    HomePageComponent,
    LoginPageComponent,
    ContentPageComponent,
    PublicPostPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
