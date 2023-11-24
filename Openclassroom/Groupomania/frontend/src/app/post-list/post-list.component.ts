import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';



@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {

  @Input() errorMessage!: string;
  

  public readonly posts$: Observable<any[]>;
  public readonly users$: Observable<any[]>;


  constructor(private postService: PostService,  private formBuilder: FormBuilder, private router: Router, private userService: UserService) { 
    this.postService.getAllPost();
    this.posts$ = this.postService.postsSubject;
    this.userService.getAllProfile();
    this.users$ = this.userService.usersSubject;
  }  

  
  getCreatePostPage() {
    this.router.navigate(['post-item']);
  }
}
