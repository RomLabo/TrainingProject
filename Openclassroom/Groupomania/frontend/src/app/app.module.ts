import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthService } from './services/auth.service';
import { AuthComponent } from './auth/auth.component';

import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './services/auth-guard.service';
import { PostListComponent } from './post-list/post-list.component';
import { PostListItemComponent } from './post-list-item/post-list-item.component';
import { PostService } from './services/post.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { PostComponent } from './post/post.component';
import { CommentComponent } from './comment/comment.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { UserService } from './services/user.service';
import { GlobalService } from './services/global.service';
import { PostModifyComponent } from './post-modify/post-modify.component';
import { UserListItemComponent } from './user-list-item/user-list-item.component';

const appRoutes : Routes = [
  { path: '', component: AuthComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'post-item', canActivate: [AuthGuard], component: PostModifyComponent },
  { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent },
  { path: 'home/:id', canActivate: [AuthGuard], component: PostComponent },
  { path: 'home/:id/modify', canActivate: [AuthGuard], component: PostModifyComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
] 

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SigninComponent,
    HomeComponent,
    NotFoundComponent,
    PostListComponent,
    PostListItemComponent,
    PostComponent,
    CommentComponent,
    HeaderComponent,
    ProfileComponent,
    PostModifyComponent,
    UserListItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthService,
    AuthGuard,
    UserService,
    GlobalService,
    PostService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
