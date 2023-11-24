import { Component, Input, OnInit, Output } from '@angular/core';



@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.scss']
})
export class PostListItemComponent implements OnInit {

  @Input() postTitle!: string;
  @Input() postContent!: string;
  @Input() postLike!: Number;
  @Input() postUser!: string;
  @Input() postUserName!: string;
  @Input() postUserFirstName!: string;
  @Input() postId!: number;
  @Input() postImageUrl!: string;
  @Input() postDay!: number;
  @Input() postHour!: number;
  @Input() postMinute!: number;
  postTitleText!: string;
  postContentText!: string;
  
  

  constructor() {}

  ngOnInit(): void {
    const outputRegExp = /\\'/g;
    this.postTitleText = outputRegExp[Symbol.replace](this.postTitle, "'");
    this.postContentText = outputRegExp[Symbol.replace](this.postContent, "'");
  }

}
