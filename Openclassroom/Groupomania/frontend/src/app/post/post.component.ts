import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalService } from '../services/global.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  
  postTitle!: string;
  postContent!: string;
  postLike!: Number;
  postUserName!: string;
  postUserFirstName!: string;
  postUser!: string;
  postImageUrl!: string;


  commentForm: FormGroup = new FormGroup({
    commentText: new FormControl(''),
  });
  isAdmin!: number;
  isUser!: string;
  clickedDeletePost: boolean = false;

  public post: any;
  comments: any[] = [];
  commentSubscription: Subscription = new Subscription;
  numberOfLike: number = 0;
  @Input() likeOf: number = 0;
  errorMessage!: string;
  

  constructor(private postService: PostService,
              private router: Router,
              private route: ActivatedRoute, 
              private formBuilder: FormBuilder, 
              private globalService: GlobalService) { }

  ngOnInit(): void {
    this.isAdmin = this.globalService.isAdmin;
    this.isUser = this.globalService.isUser;
    this.initForm();
    this.onGetOnePost();
    this.onGetPostLiker();
    const id = this.route.snapshot.params['id'];
    this.postService.getAllComments(+id);
    this.commentSubscription = this.postService.commentsSubject.subscribe(
      (comments: any[]) => {
        this.comments = comments;
      }
    )
  }

  initForm() {
    this.commentForm = this.formBuilder.group({
      commentText: ['', [Validators.minLength(3), Validators.required]]
    })
  }

  onGetOnePost() {
    const outputRegExp = /\\'/g;
    const id = this.route.snapshot.params['id'];
    this.postService.getOnePost(+id).subscribe((response: any) =>{
      if (response) {
        this.post = response;
        this.postTitle = outputRegExp[Symbol.replace](this.post.title, "'");
        this.postContent = outputRegExp[Symbol.replace](this.post.content, "'");
        this.postLike = this.post.post_like;
        this.postUserName = this.post.user_name;
        this.postUserFirstName = this.post.user_firstname;
        this.postUser = this.post.user_email;
        this.postImageUrl = this.post.image_url;
      } else {
        this.router.navigate(['']);
      }
    })
  }

  onAddComment() {
    const inputRegExp = /'/g;
    const id = this.route.snapshot.params['id'];
    const formValue = this.commentForm.value;
    const textForComment = inputRegExp[Symbol.replace](formValue['commentText'], "\\'");
    this.postService.createComment(+id, textForComment).subscribe(
      (response: any) => {
        this.postService.getAllComments(+id);
        this.commentSubscription = this.postService.commentsSubject.subscribe(
          (comments: any[]) => {
            this.comments = comments;
          }
        )
        this.commentForm.reset();
      },
      (error) => this.errorMessage = error);
  }

  onAddLike() {
    this.numberOfLike === 1 ? this.numberOfLike-- : this.numberOfLike++;
    const likeNumber = this.numberOfLike;
    const id = this.route.snapshot.params['id'];
    this.postService.addLike(+id, likeNumber).subscribe((response: any) =>{
      this.onGetOnePost();
    },
    (error) => this.errorMessage = error);
  }

  onAddDislike() {
    (this.numberOfLike === -1) ? this.numberOfLike++ : this.numberOfLike--;
    const likeNumber = this.numberOfLike;
    const id = this.route.snapshot.params['id'];
    this.postService.addLike(+id, likeNumber).subscribe((response: any) =>{
      this.onGetOnePost();
    },
    (error) => this.errorMessage = error);
  }

  onGetPostLiker() {
    const id = this.route.snapshot.params['id'];
    this.postService.getPostLiker(+id).subscribe(
      (response: any) =>{
        if (response) {
          this.numberOfLike = response.user_like;
        } 
      }
    )
  }

  deleteClick() {
    this.clickedDeletePost = true;
  }

  giveUpDelete() {
    this.clickedDeletePost = false;
  }

  onDeleteOnePost() {
    const id = this.route.snapshot.params['id'];
    this.postService.deleteOnePost(+id).subscribe(
      (response: any) => {
        this.router.navigate(['home']);   
      },
      (error) => {this.errorMessage = error.error}
    );
  }

  ngOnDestroy() {
    this.commentSubscription.unsubscribe();
  }
}
