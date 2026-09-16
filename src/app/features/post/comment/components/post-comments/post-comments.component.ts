import { Component, inject, input, OnInit } from '@angular/core';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { PostFacadeService } from '../../../services/post-facade.service';
import { CommentsEmptyComponent } from '../comments-empty/comments-empty.component';
import { ICreateCommentREQ } from '../../interfaces/comment.interface';
import { CommentTextAreaComponent } from '../comment-text-area/comment-text-area.component';

@Component({
  imports: [CommentCardComponent, CommentTextAreaComponent, CommentsEmptyComponent],
  selector: 'app-post-comments',
  styleUrl: './post-comments.component.css',
  templateUrl: './post-comments.component.html',
})
export class PostCommentsComponent implements OnInit {
  protected readonly postFacade = inject(PostFacadeService);

  postId = input.required<string>();

  createPost(data: ICreateCommentREQ): void {
    this.postFacade.createComment(this.postId(), data);
  }

  ngOnInit(): void {
    this.postFacade.getPostComments(this.postId());
  }
}
