import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() commentUserName!: string;
  @Input() commentUserFirstName!: string;
  @Input() commentId!: number;
  @Input() commentUserMail!: string;
  @Input() commentDay!: number;
  @Input() commentHour!: number;
  @Input() commentMinute!: number;
  @Input() commentContent!: string;
  isAdmin!: number;
  clickedDeleteComment: boolean = false;
  errorMessage!: string;
  commentContentText!: string;
  

  constructor(private globalService: GlobalService, private postService: PostService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isAdmin = this.globalService.isAdmin;
    const outputRegExp = /\\'/g;
    this.commentContentText = outputRegExp[Symbol.replace](this.commentContent, "'");
  }

  deleteClick() {
    this.clickedDeleteComment = true;
  }

  giveUpDelete() {
    this.clickedDeleteComment = false;
  }

  onDeleteOneComment() {
    const idComment = this.commentId;
    const id = this.route.snapshot.params['id'];
    this.postService.deleteOneComment(+idComment)
      .subscribe(
        (response: any) => {
          this.postService.getAllComments(+id);
        },
        (error) => {this.errorMessage = error.error}
      );
  }

}
